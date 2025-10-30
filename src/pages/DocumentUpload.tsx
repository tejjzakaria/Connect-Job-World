import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { documentsAPI } from "@/lib/api";
import { formatFullDateTime } from "@/lib/dateUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LinkData {
  isValid: boolean;
  submission: {
    _id: string;
    name: string;
    phone: string;
    email?: string;
    service: string;
  };
  uploadCount: number;
  maxUploads: number;
  expiresAt: string;
}

interface UploadFile {
  file: File;
  documentType: string;
}

const DOCUMENT_TYPES = [
  { value: "passport", label: "جواز السفر" },
  { value: "national_id", label: "بطاقة الهوية الوطنية" },
  { value: "birth_certificate", label: "شهادة الميلاد" },
  { value: "diploma", label: "الشهادة الدراسية" },
  { value: "work_contract", label: "عقد العمل" },
  { value: "bank_statement", label: "كشف حساب بنكي" },
  { value: "proof_of_address", label: "إثبات العنوان" },
  { value: "marriage_certificate", label: "عقد الزواج" },
  { value: "police_clearance", label: "السجل العدلي" },
  { value: "medical_report", label: "تقرير طبي" },
  { value: "other", label: "أخرى" },
];

const DocumentUpload = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [linkData, setLinkData] = useState<LinkData | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    validateLink();
  }, [token]);

  const validateLink = async () => {
    try {
      setIsValidating(true);
      const response = await documentsAPI.validateLink(token!);
      setLinkData(response.data);
    } catch (error: any) {
      console.error("Error validating link:", error);
      toast({
        title: "رابط غير صالح",
        description: error.message || "هذا الرابط غير صالح أو منتهي الصلاحية",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = linkData!.maxUploads - linkData!.uploadCount - uploadFiles.length;

    if (files.length > remainingSlots) {
      toast({
        title: "تجاوز الحد الأقصى",
        description: `يمكنك رفع ${remainingSlots} ملف فقط`,
        variant: "destructive",
      });
      return;
    }

    const newFiles: UploadFile[] = Array.from(files).map(file => ({
      file,
      documentType: "other",
    }));

    setUploadFiles([...uploadFiles, ...newFiles]);
  };

  const updateDocumentType = (index: number, documentType: string) => {
    const updated = [...uploadFiles];
    updated[index].documentType = documentType;
    setUploadFiles(updated);
  };

  const removeFile = (index: number) => {
    const updated = uploadFiles.filter((_, i) => i !== index);
    setUploadFiles(updated);
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) {
      toast({
        title: "لم يتم اختيار ملفات",
        description: "يرجى اختيار ملف واحد على الأقل للرفع",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      const files = uploadFiles.map(uf => uf.file);
      const documentTypes = uploadFiles.map(uf => uf.documentType);

      await documentsAPI.uploadDocuments(token!, files, documentTypes);

      setUploadSuccess(true);
      toast({
        title: "تم الرفع بنجاح!",
        description: `تم رفع ${uploadFiles.length} ملف بنجاح`,
      });

      // Refresh link data to update upload count
      setTimeout(() => {
        validateLink();
        setUploadFiles([]);
      }, 2000);
    } catch (error: any) {
      console.error("Error uploading documents:", error);
      toast({
        title: "فشل الرفع",
        description: error.message || "حدث خطأ أثناء رفع الملفات",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="p-12 max-w-md w-full text-center">
          <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-lg text-muted-foreground">جاري التحقق من الرابط...</p>
        </Card>
      </div>
    );
  }

  if (!linkData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="p-12 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">رابط غير صالح</h2>
          <p className="text-muted-foreground mb-6">
            هذا الرابط غير صالح أو منتهي الصلاحية
          </p>
          <Button onClick={() => navigate("/")} variant="outline">
            العودة إلى الصفحة الرئيسية
          </Button>
        </Card>
      </div>
    );
  }

  if (uploadSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="p-12 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">تم الرفع بنجاح!</h2>
          <p className="text-muted-foreground mb-6">
            تم رفع مستنداتك بنجاح. سيتم مراجعتها قريباً
          </p>
          <div className="space-y-3">
            <Button onClick={() => setUploadSuccess(false)} className="w-full">
              رفع ملفات إضافية
            </Button>
            <Button onClick={() => navigate("/")} variant="outline" className="w-full">
              العودة إلى الصفحة الرئيسية
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const remainingUploads = linkData.maxUploads - linkData.uploadCount;
  const expiresAt = new Date(linkData.expiresAt);
  const isExpiringSoon = expiresAt.getTime() - Date.now() < 24 * 60 * 60 * 1000; // Less than 24 hours

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Upload className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold">رفع المستندات</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">
            مرحباً {linkData.submission.name}
          </h1>
          <p className="text-xl text-muted-foreground">
            يرجى رفع المستندات المطلوبة للخدمة: {linkData.submission.service}
          </p>
        </div>

        {/* Info Card */}
        <Card className="p-6 mb-6 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm">
              <p className="text-blue-900 font-semibold">معلومات الرابط:</p>
              <ul className="text-blue-800 space-y-1">
                <li>• الحد الأقصى للرفع: {linkData.maxUploads} ملف</li>
                <li>• المستخدم: {linkData.uploadCount} / {linkData.maxUploads}</li>
                <li>• المتبقي: {remainingUploads} ملف</li>
                <li className={isExpiringSoon ? "text-red-600 font-semibold" : ""}>
                  • ينتهي في: {formatFullDateTime(expiresAt)}
                  {isExpiringSoon && " (ينتهي قريباً!)"}
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Upload Card */}
        <Card className="p-8">
          {/* File Input */}
          <div className="mb-6">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-all"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 text-primary mb-3" />
                <p className="mb-2 text-lg font-semibold text-foreground">
                  اضغط لاختيار الملفات
                </p>
                <p className="text-sm text-muted-foreground">
                  PDF, صور, Word, Excel (حد أقصى 10 ميجا للملف الواحد)
                </p>
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx"
                onChange={handleFileSelect}
                disabled={remainingUploads === 0}
              />
            </label>
          </div>

          {/* Selected Files */}
          {uploadFiles.length > 0 && (
            <div className="space-y-3 mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                الملفات المحددة ({uploadFiles.length})
              </h3>
              {uploadFiles.map((uploadFile, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start gap-4">
                    <FileText className="w-10 h-10 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        {uploadFile.file.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(uploadFile.file.size)}
                      </p>
                      <div className="mt-3">
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          نوع المستند
                        </label>
                        <Select
                          value={uploadFile.documentType}
                          onValueChange={(value) => updateDocumentType(index, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DOCUMENT_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <XCircle className="w-5 h-5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={uploadFiles.length === 0 || isUploading}
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary-dark hover:via-primary hover:to-secondary"
          >
            {isUploading ? (
              <span className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                جاري الرفع...
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <Upload className="w-5 h-5" />
                رفع {uploadFiles.length} ملف
              </span>
            )}
          </Button>

          {/* Help Text */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>تأكد من أن جميع المستندات واضحة وقابلة للقراءة</p>
            <p className="mt-1">في حالة وجود مشاكل، يرجى التواصل معنا</p>
          </div>
        </Card>

        {/* Contact Info */}
        <Card className="mt-6 p-6 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="text-center">
            <p className="text-foreground font-semibold mb-2">هل تحتاج مساعدة؟</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a
                href={`tel:${linkData.submission.phone}`}
                className="text-primary hover:underline"
              >
                الهاتف: {linkData.submission.phone}
              </a>
              {linkData.submission.email && (
                <a
                  href={`mailto:${linkData.submission.email}`}
                  className="text-primary hover:underline"
                >
                  البريد: {linkData.submission.email}
                </a>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DocumentUpload;
