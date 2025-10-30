import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FileText,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Link as LinkIcon,
  Clock,
  Eye,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { DocumentPreview } from "@/components/admin/DocumentPreview";
import { documentsAPI, submissionsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Document {
  _id: string;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  documentType: string;
  status: "pending" | "verified" | "rejected" | "needs_replacement";
  verifiedBy?: any;
  verifiedAt?: string;
  rejectionReason?: string;
  notes?: string;
  createdAt: string;
}

interface Submission {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  service: string;
  workflowStatus?: string;
}

interface DocumentLink {
  _id: string;
  token: string;
  expiresAt: string;
  isActive: boolean;
  uploadCount: number;
  maxUploads: number;
  createdAt: string;
}

const DOCUMENT_TYPES_AR: Record<string, string> = {
  passport: "جواز السفر",
  national_id: "بطاقة الهوية الوطنية",
  birth_certificate: "شهادة الميلاد",
  diploma: "الشهادة الدراسية",
  work_contract: "عقد العمل",
  bank_statement: "كشف حساب بنكي",
  proof_of_address: "إثبات العنوان",
  marriage_certificate: "عقد الزواج",
  police_clearance: "السجل العدلي",
  medical_report: "تقرير طبي",
  other: "أخرى",
};

const SubmissionDocuments = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentLinks, setDocumentLinks] = useState<DocumentLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Review dialog state
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [reviewStatus, setReviewStatus] = useState<"verified" | "rejected" | "needs_replacement">("verified");
  const [reviewNotes, setReviewNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  // Preview dialog state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);

  useEffect(() => {
    fetchData();
  }, [submissionId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Fetch submission details
      const submissionRes = await submissionsAPI.getById(submissionId!);
      if (submissionRes.success) {
        setSubmission(submissionRes.data);
      }

      // Fetch documents
      const docsRes = await documentsAPI.getBySubmission(submissionId!);
      if (docsRes.success) {
        setDocuments(docsRes.data);
      }

      // Fetch document links
      const linksRes = await documentsAPI.getLinks(submissionId!);
      if (linksRes.success) {
        setDocumentLinks(linksRes.data);
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast({
        title: "خطأ في تحميل البيانات",
        description: error.message || "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openReviewDialog = (document: Document) => {
    setSelectedDocument(document);
    setReviewStatus("verified");
    setReviewNotes(document.notes || "");
    setRejectionReason(document.rejectionReason || "");
    setReviewDialogOpen(true);
  };

  const handleReview = async () => {
    if (!selectedDocument) return;

    try {
      const response = await documentsAPI.verify(selectedDocument._id, {
        status: reviewStatus,
        rejectionReason: reviewStatus === "rejected" ? rejectionReason : undefined,
        notes: reviewNotes,
      });

      if (response.success) {
        toast({
          title: "تم المراجعة بنجاح",
          description:
            reviewStatus === "verified"
              ? "تم التحقق من المستند"
              : reviewStatus === "rejected"
              ? "تم رفض المستند"
              : "يحتاج المستند إلى استبدال",
        });
        setReviewDialogOpen(false);
        fetchData();
      }
    } catch (error: any) {
      toast({
        title: "خطأ في المراجعة",
        description: error.message || "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    }
  };

  const handleDownload = (documentId: string) => {
    documentsAPI.download(documentId);
  };

  const openPreview = (document: Document) => {
    setPreviewDocument(document);
    setPreviewOpen(true);
  };

  const closePreview = () => {
    setPreviewOpen(false);
    setPreviewDocument(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
            <CheckCircle className="w-3 h-3" />
            موثق
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3" />
            مرفوض
          </span>
        );
      case "needs_replacement":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">
            <AlertCircle className="w-3 h-3" />
            يحتاج استبدال
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3" />
            قيد المراجعة
          </span>
        );
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!submission) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">الطلب غير موجود</p>
          <Button onClick={() => navigate("/admin/submissions")} className="mt-4">
            العودة إلى الطلبات
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const allDocumentsVerified = documents.length > 0 && documents.every(doc => doc.status === "verified");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/submissions")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            رجوع
          </Button>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-foreground">مستندات {submission.name}</h2>
            <p className="text-muted-foreground mt-1">
              الخدمة: {submission.service}
            </p>
          </div>
        </div>

        {/* Submission Info Card */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">الاسم</p>
              <p className="font-semibold text-foreground">{submission.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">الهاتف</p>
              <p className="font-semibold text-foreground">{submission.phone}</p>
            </div>
            {submission.email && (
              <div>
                <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                <p className="font-semibold text-foreground">{submission.email}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Document Links */}
        {documentLinks.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">روابط رفع المستندات</h3>
            <div className="space-y-3">
              {documentLinks.map((link) => (
                <div
                  key={link._id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <LinkIcon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">
                        {link.isActive ? "رابط نشط" : "رابط معطل"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        تم الاستخدام: {link.uploadCount} / {link.maxUploads} | ينتهي في:{" "}
                        {new Date(link.expiresAt).toLocaleDateString("ar-EG")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {link.isActive && new Date(link.expiresAt) > new Date() && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const url = `${window.location.origin}/upload/${link.token}`;
                          navigator.clipboard.writeText(url);
                          toast({ title: "تم النسخ", description: "تم نسخ الرابط إلى الحافظة" });
                        }}
                      >
                        نسخ الرابط
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Documents List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">
              المستندات المرفوعة ({documents.length})
            </h3>
            {allDocumentsVerified && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">جميع المستندات موثقة</span>
              </div>
            )}
          </div>

          {documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">لا توجد مستندات مرفوعة بعد</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((document) => (
                <Card key={document._id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <FileText className="w-12 h-12 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground truncate">
                            {document.fileName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {DOCUMENT_TYPES_AR[document.documentType] || document.documentType}
                          </p>
                          {document.originalName !== document.fileName && (
                            <p className="text-xs text-muted-foreground italic">
                              الاسم الأصلي: {document.originalName}
                            </p>
                          )}
                        </div>
                        {getStatusBadge(document.status)}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <span>{formatFileSize(document.fileSize)}</span>
                        <span>{new Date(document.createdAt).toLocaleDateString("ar-EG")}</span>
                      </div>

                      {document.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
                          <p className="text-sm text-red-900 font-semibold">سبب الرفض:</p>
                          <p className="text-sm text-red-800">{document.rejectionReason}</p>
                        </div>
                      )}

                      {document.notes && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                          <p className="text-sm text-blue-900 font-semibold">ملاحظات:</p>
                          <p className="text-sm text-blue-800">{document.notes}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          className="gap-2"
                          onClick={() => openPreview(document)}
                        >
                          <Eye className="w-4 h-4" />
                          معاينة
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleDownload(document._id)}
                        >
                          <Download className="w-4 h-4" />
                          تحميل
                        </Button>
                        {document.status !== "verified" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => openReviewDialog(document)}
                          >
                            <CheckCircle className="w-4 h-4" />
                            مراجعة
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Preview Dialog */}
      {previewDocument && (
        <DocumentPreview
          documentId={previewDocument._id}
          documentName={previewDocument.originalName}
          fileType={previewDocument.fileType}
          isOpen={previewOpen}
          onClose={closePreview}
          onDownload={() => handleDownload(previewDocument._id)}
        />
      )}

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent dir="rtl" className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>مراجعة المستند</DialogTitle>
            <DialogDescription>
              {selectedDocument?.originalName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">الحالة</label>
              <Select value={reviewStatus} onValueChange={(value: any) => setReviewStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="verified">موثق - مقبول</SelectItem>
                  <SelectItem value="rejected">مرفوض</SelectItem>
                  <SelectItem value="needs_replacement">يحتاج استبدال</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {reviewStatus === "rejected" && (
              <div className="space-y-2">
                <label className="text-sm font-semibold">سبب الرفض</label>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="اشرح سبب رفض المستند..."
                  className="min-h-24"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold">ملاحظات (اختياري)</label>
              <Textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="أضف أي ملاحظات..."
                className="min-h-24"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleReview}>
              {reviewStatus === "verified" ? "موافقة" : "رفض"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default SubmissionDocuments;
