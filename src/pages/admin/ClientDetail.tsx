import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Loader2,
  Edit,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { clientsAPI, submissionsAPI, documentsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Client {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  service: string;
  status: string;
  message: string;
  date: string;
  createdAt: string;
}

interface Document {
  _id: string;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  documentType: string;
  status: string;
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

const ClientDetail = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [client, setClient] = useState<Client | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchClientData();
  }, [clientId]);

  const fetchClientData = async () => {
    try {
      setIsLoading(true);

      // Fetch client details
      const clientRes = await clientsAPI.getById(clientId!);
      if (clientRes.success && clientRes.data) {
        setClient(clientRes.data);
      }

      // Find the submission that was converted to this client
      const submissionsRes = await submissionsAPI.getAll({ limit: 1000 });
      if (submissionsRes.success && submissionsRes.data) {
        const relatedSubmission = submissionsRes.data.find(
          (sub: any) => {
            // Handle both cases: clientId as ObjectId string or as populated object
            const subClientId = typeof sub.clientId === 'object' && sub.clientId?._id
              ? sub.clientId._id
              : sub.clientId;
            return subClientId?.toString() === clientId;
          }
        );

        if (relatedSubmission) {
          setSubmissionId(relatedSubmission._id);

          // Fetch documents for this submission
          const docsRes = await documentsAPI.getBySubmission(relatedSubmission._id);
          if (docsRes.success && docsRes.data) {
            setDocuments(docsRes.data);
          }
        }
      }
    } catch (error: any) {
      console.error("Error fetching client data:", error);
      toast({
        title: "خطأ في تحميل البيانات",
        description: error.message || "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "جديد":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "قيد المراجعة":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "مكتمل":
        return "bg-green-100 text-green-700 border-green-200";
      case "مرفوض":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getDocStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
            <CheckCircle className="w-3 h-3" />
            موثق
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3" />
            مرفوض
          </span>
        );
      case "needs_replacement":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">
            <AlertCircle className="w-3 h-3" />
            يحتاج استبدال
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3" />
            قيد المراجعة
          </span>
        );
    }
  };

  const handleDownload = (documentId: string) => {
    documentsAPI.download(documentId);
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

  if (!client) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">العميل غير موجود</p>
          <Button onClick={() => navigate("/admin/clients")} className="mt-4">
            العودة إلى العملاء
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/admin/clients")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              رجوع
            </Button>
            <div>
              <h2 className="text-3xl font-bold text-foreground">{client.name}</h2>
              <p className="text-muted-foreground mt-1">تفاصيل العميل</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => navigate(`/admin/clients/${clientId}/edit`)}
          >
            <Edit className="w-4 h-4" />
            تعديل
          </Button>
        </div>

        {/* Client Info Card */}
        <Card className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Phone className="w-4 h-4" />
                <span>رقم الهاتف</span>
              </div>
              <p className="font-semibold text-foreground">{client.phone}</p>
            </div>

            {client.email && (
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Mail className="w-4 h-4" />
                  <span>البريد الإلكتروني</span>
                </div>
                <p className="font-semibold text-foreground truncate">{client.email}</p>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Briefcase className="w-4 h-4" />
                <span>الخدمة</span>
              </div>
              <p className="font-semibold text-foreground">{client.service}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Calendar className="w-4 h-4" />
                <span>تاريخ التسجيل</span>
              </div>
              <p className="font-semibold text-foreground">
                {new Date(client.date || client.createdAt).toLocaleDateString("ar-EG")}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">الحالة</h3>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                  client.status
                )}`}
              >
                {client.status}
              </span>
            </div>
          </div>

          {client.message && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-foreground mb-3">الرسالة</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {client.message}
              </p>
            </div>
          )}
        </Card>

        {/* Documents Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">
              المستندات ({documents.length})
            </h3>
            {submissionId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/admin/submissions/${submissionId}/documents`)}
              >
                إدارة المستندات
              </Button>
            )}
          </div>

          {documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">لا توجد مستندات مرفوعة</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {documents.map((document) => (
                <div
                  key={document._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <FileText className="w-10 h-10 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        {document.fileName}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-muted-foreground">
                          {DOCUMENT_TYPES_AR[document.documentType] || document.documentType}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(document.fileSize)}
                        </p>
                        {getDocStatusBadge(document.status)}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleDownload(document._id)}
                  >
                    <Download className="w-4 h-4" />
                    تحميل
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ClientDetail;
