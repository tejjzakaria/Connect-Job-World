import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
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
  CreditCard,
  DollarSign,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { DocumentPreview } from "@/components/admin/DocumentPreview";
import { documentsAPI, submissionsAPI, paymentsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { formatShortDate, formatDateTime } from "@/lib/dateUtils";
import { useTranslation } from "react-i18next";

interface Document {
  _id: string;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  documentType: string;
  status: "pending" | "verified" | "rejected" | "needs_replacement";
  verifiedBy?: {
    _id: string;
    name: string;
    email: string;
  };
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

interface PaymentLink {
  _id: string;
  token: string;
  amount: number;
  currency: string;
  status: 'pending' | 'receipt_uploaded' | 'confirmed' | 'rejected';
  expiresAt: string;
  isActive: boolean;
  receiptFile?: {
    fileName: string;
    originalName: string;
    fileType: string;
    fileSize: number;
    uploadedAt: string;
  };
  generatedBy?: {
    _id: string;
    name: string;
  };
  confirmedBy?: {
    _id: string;
    name: string;
  };
  confirmedAt?: string;
  rejectedBy?: {
    _id: string;
    name: string;
  };
  rejectedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

// Helper function to get service translation from key
const getServiceTranslation = (serviceKey: string, t: any) => {
  const serviceMap: Record<string, string> = {
    'us_lottery': t('submissions.serviceUSLottery'),
    'canada_immigration': t('submissions.serviceCanadaImmigration'),
    'work_visa': t('submissions.serviceWorkVisa'),
    'study_abroad': t('submissions.serviceStudyAbroad'),
    'family_reunion': t('submissions.serviceFamilyReunion'),
    'soccer_talent': t('submissions.serviceSoccerTalent'),
  };

  // Return translated value if key exists, otherwise return the original (for backwards compatibility)
  return serviceMap[serviceKey] || serviceKey;
};

const SubmissionDocuments = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Get initial tab from URL query param
  const initialTab = searchParams.get('tab') === 'payment' ? 'payment' : 'documents';
  const [activeTab, setActiveTab] = useState(initialTab);

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentLinks, setDocumentLinks] = useState<DocumentLink[]>([]);
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([]);
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

  // Payment review dialog state
  const [paymentReviewDialogOpen, setPaymentReviewDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentLink | null>(null);
  const [paymentReviewStatus, setPaymentReviewStatus] = useState<"confirmed" | "rejected">("confirmed");
  const [paymentRejectionReason, setPaymentRejectionReason] = useState("");

  // Payment receipt preview state
  const [paymentPreviewOpen, setPaymentPreviewOpen] = useState(false);
  const [paymentPreviewUrl, setPaymentPreviewUrl] = useState<string | null>(null);
  const [paymentPreviewType, setPaymentPreviewType] = useState<string>("");

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

      // Fetch payment links
      try {
        const paymentLinksRes = await paymentsAPI.getLinks(submissionId!);
        if (paymentLinksRes.success) {
          setPaymentLinks(paymentLinksRes.data);
        }
      } catch (e) {
        // Payment links may not exist, that's ok
        setPaymentLinks([]);
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast({
        title: t('submissionDocs.loadError'),
        description: error.message || t('dashboard.tryAgain'),
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
          title: t('submissionDocs.reviewSuccess'),
          description:
            reviewStatus === "verified"
              ? t('submissionDocs.verifiedSuccess')
              : reviewStatus === "rejected"
              ? t('submissionDocs.rejectedSuccess')
              : t('submissionDocs.needsReplacementSuccess'),
        });
        setReviewDialogOpen(false);
        fetchData();
      }
    } catch (error: any) {
      toast({
        title: t('submissionDocs.reviewError'),
        description: error.message || t('dashboard.tryAgain'),
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

  // Payment review functions
  const openPaymentReviewDialog = (payment: PaymentLink) => {
    setSelectedPayment(payment);
    setPaymentReviewStatus("confirmed");
    setPaymentRejectionReason("");
    setPaymentReviewDialogOpen(true);
  };

  const handlePaymentReview = async () => {
    if (!selectedPayment) return;

    try {
      const response = await paymentsAPI.verify(selectedPayment._id, {
        status: paymentReviewStatus,
        rejectionReason: paymentReviewStatus === "rejected" ? paymentRejectionReason : undefined,
      });

      if (response.success) {
        toast({
          title: t('common.success'),
          description: paymentReviewStatus === "confirmed"
            ? t('submissionDocs.paymentConfirmed')
            : t('submissionDocs.paymentRejected'),
        });
        setPaymentReviewDialogOpen(false);
        fetchData();
      }
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message || t('dashboard.tryAgain'),
        variant: "destructive",
      });
    }
  };

  const previewPaymentReceipt = async (payment: PaymentLink) => {
    try {
      const response = await paymentsAPI.previewReceipt(payment._id);
      if (response.success && response.url) {
        setPaymentPreviewUrl(response.url);
        setPaymentPreviewType(response.fileType || payment.receiptFile?.fileType || '');
        setPaymentPreviewOpen(true);
      }
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message || t('dashboard.tryAgain'),
        variant: "destructive",
      });
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
            <CheckCircle className="w-3 h-3" />
            {t('submissionDocs.paymentStatusConfirmed')}
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3" />
            {t('submissionDocs.paymentStatusRejected')}
          </span>
        );
      case "receipt_uploaded":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3 h-3" />
            {t('submissionDocs.paymentStatusReceiptUploaded')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3" />
            {t('submissionDocs.paymentStatusPending')}
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
            <CheckCircle className="w-3 h-3" />
            {t('submissionDocs.statusVerified').split(' - ')[0]}
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3" />
            {t('submissionDocs.statusRejected')}
          </span>
        );
      case "needs_replacement":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">
            <AlertCircle className="w-3 h-3" />
            {t('submissionDocs.statusNeedsReplacement')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3" />
            {t('submissionDocs.statusPending')}
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
          <p className="text-muted-foreground">{t('submissionDocs.notFound')}</p>
          <Button onClick={() => navigate("/admin/submissions")} className="mt-4">
            {t('submissionDocs.backToSubmissions')}
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
            {t('submissionDocs.back')}
          </Button>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-foreground">{t('submissionDocs.title', { name: submission.name })}</h2>
            <p className="text-muted-foreground mt-1">
              {t('submissionDocs.service')}: {getServiceTranslation(submission.service, t)}
            </p>
          </div>
        </div>

        {/* Submission Info Card */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{t('submissionDocs.name')}</p>
              <p className="font-semibold text-foreground">{submission.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('submissionDocs.phone')}</p>
              <p className="font-semibold text-foreground">{submission.phone}</p>
            </div>
            {submission.email && (
              <div>
                <p className="text-sm text-muted-foreground">{t('submissionDocs.email')}</p>
                <p className="font-semibold text-foreground">{submission.email}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Tabs for Payment and Documents */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="payment" className="gap-2">
              <CreditCard className="w-4 h-4" />
              {t('submissionDocs.paymentTab')} {paymentLinks.length > 0 && `(${paymentLinks.length})`}
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2">
              <FileText className="w-4 h-4" />
              {t('submissionDocs.documentsTab')} ({documents.length})
            </TabsTrigger>
          </TabsList>

          {/* Payment Tab */}
          <TabsContent value="payment" className="space-y-6">
            {paymentLinks.length === 0 ? (
              <Card className="p-12 text-center">
                <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t('submissionDocs.noPaymentLinks')}</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {paymentLinks.map((payment) => (
                  <Card key={payment._id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">
                            {payment.amount.toLocaleString()} {payment.currency}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {t('submissionDocs.createdOn')}: {formatShortDate(payment.createdAt)}
                          </p>
                        </div>
                      </div>
                      {getPaymentStatusBadge(payment.status)}
                    </div>

                    {/* Payment Link Info */}
                    <div className="bg-muted/30 rounded-lg p-4 mb-4">
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">{t('submissionDocs.paymentLinkStatus')}</p>
                          <p className="font-medium">
                            {payment.isActive && new Date(payment.expiresAt) > new Date()
                              ? t('submissionDocs.activeLink')
                              : t('submissionDocs.inactiveLink')}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">{t('submissionDocs.expiresAt')}</p>
                          <p className="font-medium">{formatShortDate(payment.expiresAt)}</p>
                        </div>
                        {payment.generatedBy && (
                          <div>
                            <p className="text-muted-foreground">{t('submissionDocs.generatedBy')}</p>
                            <p className="font-medium">{payment.generatedBy.name}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Receipt Info */}
                    {payment.receiptFile && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                        <p className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          {t('submissionDocs.receiptUploaded')}
                        </p>
                        <div className="text-sm text-amber-800">
                          <p>{t('submissionDocs.fileName')}: {payment.receiptFile.originalName}</p>
                          <p>{t('submissionDocs.uploadedOn')}: {formatDateTime(payment.receiptFile.uploadedAt)}</p>
                          <p>{t('submissionDocs.fileSize')}: {formatFileSize(payment.receiptFile.fileSize)}</p>
                        </div>
                      </div>
                    )}

                    {/* Confirmation Info */}
                    {payment.status === 'confirmed' && payment.confirmedBy && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <p className="font-semibold text-green-900">
                          {t('submissionDocs.paymentConfirmedBy')}: {payment.confirmedBy.name}
                        </p>
                        <p className="text-sm text-green-800">
                          {formatDateTime(payment.confirmedAt!)}
                        </p>
                      </div>
                    )}

                    {/* Rejection Info */}
                    {payment.status === 'rejected' && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <p className="font-semibold text-red-900">
                          {t('submissionDocs.paymentRejectedBy')}: {payment.rejectedBy?.name}
                        </p>
                        {payment.rejectionReason && (
                          <p className="text-sm text-red-800 mt-1">
                            {t('submissionDocs.rejectionReason')}: {payment.rejectionReason}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {payment.isActive && new Date(payment.expiresAt) > new Date() && payment.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const url = `${window.location.origin}/payment/${payment.token}`;
                            navigator.clipboard.writeText(url);
                            toast({ title: t('submissionDocs.linkCopied'), description: t('submissionDocs.paymentLinkCopiedDesc') });
                          }}
                        >
                          {t('submissionDocs.copyPaymentLink')}
                        </Button>
                      )}
                      {payment.receiptFile && (
                        <Button
                          variant="default"
                          size="sm"
                          className="gap-2"
                          onClick={() => previewPaymentReceipt(payment)}
                        >
                          <Eye className="w-4 h-4" />
                          {t('submissionDocs.viewReceipt')}
                        </Button>
                      )}
                      {payment.status === 'receipt_uploaded' && (
                        <Button
                          variant="default"
                          size="sm"
                          className="gap-2 bg-amber-600 hover:bg-amber-700"
                          onClick={() => openPaymentReviewDialog(payment)}
                        >
                          <CheckCircle className="w-4 h-4" />
                          {t('submissionDocs.verifyPayment')}
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            {/* Document Links */}
            {documentLinks.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">{t('submissionDocs.uploadLinksTitle')}</h3>
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
                            {link.isActive ? t('submissionDocs.activeLink') : t('submissionDocs.inactiveLink')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t('submissionDocs.used')}: {link.uploadCount} / {link.maxUploads} | {t('submissionDocs.expiresAt')}:{" "}
                            {formatShortDate(link.expiresAt)}
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
                              toast({ title: t('submissionDocs.linkCopied'), description: t('submissionDocs.linkCopiedDesc') });
                            }}
                          >
                            {t('submissionDocs.copyLink')}
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
              {t('submissionDocs.uploadedDocuments')} ({documents.length})
            </h3>
            {allDocumentsVerified && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">{t('submissionDocs.allDocumentsVerified')}</span>
              </div>
            )}
          </div>

          {documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t('submissionDocs.noDocuments')}</p>
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
                            {t(`docTypes.${document.documentType}`, { defaultValue: document.documentType })}
                          </p>
                          {document.originalName !== document.fileName && (
                            <p className="text-xs text-muted-foreground italic">
                              {t('submissionDocs.originalName')}: {document.originalName}
                            </p>
                          )}
                        </div>
                        {getStatusBadge(document.status)}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <span>{formatFileSize(document.fileSize)}</span>
                        <span>{t('submissionDocs.uploadedOn')}: {formatShortDate(document.createdAt)}</span>
                      </div>

                      {/* Verification Info */}
                      {document.verifiedBy && document.verifiedAt && (
                        <div className={`text-xs mb-3 p-2 rounded ${
                          document.status === 'verified'
                            ? 'bg-green-50 border border-green-200'
                            : document.status === 'rejected'
                            ? 'bg-red-50 border border-red-200'
                            : 'bg-yellow-50 border border-yellow-200'
                        }`}>
                          <p className={`font-semibold ${
                            document.status === 'verified'
                              ? 'text-green-900'
                              : document.status === 'rejected'
                              ? 'text-red-900'
                              : 'text-yellow-900'
                          }`}>
                            {document.status === 'verified'
                              ? `✓ ${t('submissionDocs.verified')}`
                              : document.status === 'rejected'
                              ? `✗ ${t('submissionDocs.rejected')}`
                              : `⚠ ${t('submissionDocs.needsReplacement')}`}
                          </p>
                          <p className={`${
                            document.status === 'verified'
                              ? 'text-green-800'
                              : document.status === 'rejected'
                              ? 'text-red-800'
                              : 'text-yellow-800'
                          }`}>
                            {t('submissionDocs.verifiedBy')}: {document.verifiedBy.name} • {formatDateTime(document.verifiedAt)}
                          </p>
                        </div>
                      )}

                      {document.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
                          <p className="text-sm text-red-900 font-semibold">{t('submissionDocs.rejectionReason')}:</p>
                          <p className="text-sm text-red-800">{document.rejectionReason}</p>
                        </div>
                      )}

                      {document.notes && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                          <p className="text-sm text-blue-900 font-semibold">{t('submissionDocs.notes')}:</p>
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
                          {t('submissionDocs.preview')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleDownload(document._id)}
                        >
                          <Download className="w-4 h-4" />
                          {t('submissionDocs.download')}
                        </Button>
                        {document.status !== "verified" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => openReviewDialog(document)}
                          >
                            <CheckCircle className="w-4 h-4" />
                            {t('submissionDocs.review')}
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
          </TabsContent>
        </Tabs>
      </div>

      {/* Payment Receipt Preview Dialog */}
      <Dialog open={paymentPreviewOpen} onOpenChange={setPaymentPreviewOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{t('submissionDocs.receiptPreview')}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center min-h-[400px] bg-muted/30 rounded-lg overflow-auto">
            {paymentPreviewUrl && (
              paymentPreviewType.includes('image') ? (
                <img
                  src={paymentPreviewUrl}
                  alt="Payment Receipt"
                  className="max-w-full max-h-[70vh] object-contain"
                />
              ) : paymentPreviewType.includes('pdf') ? (
                <iframe
                  src={paymentPreviewUrl}
                  className="w-full h-[70vh]"
                  title="Payment Receipt"
                />
              ) : (
                <div className="text-center p-8">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">{t('submissionDocs.cannotPreview')}</p>
                  <Button asChild>
                    <a href={paymentPreviewUrl} target="_blank" rel="noopener noreferrer">
                      {t('submissionDocs.openInNewTab')}
                    </a>
                  </Button>
                </div>
              )
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Review Dialog */}
      <Dialog open={paymentReviewDialogOpen} onOpenChange={setPaymentReviewDialogOpen}>
        <DialogContent dir={isRTL ? 'rtl' : 'ltr'} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('submissionDocs.verifyPaymentTitle')}</DialogTitle>
            <DialogDescription>
              {selectedPayment && `${selectedPayment.amount.toLocaleString()} ${selectedPayment.currency}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('submissionDocs.paymentAction')}</label>
              <Select value={paymentReviewStatus} onValueChange={(value: any) => setPaymentReviewStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">{t('submissionDocs.confirmPayment')}</SelectItem>
                  <SelectItem value="rejected">{t('submissionDocs.rejectPayment')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {paymentReviewStatus === "rejected" && (
              <div className="space-y-2">
                <label className="text-sm font-semibold">{t('submissionDocs.rejectionReason')}</label>
                <Textarea
                  value={paymentRejectionReason}
                  onChange={(e) => setPaymentRejectionReason(e.target.value)}
                  placeholder={t('submissionDocs.paymentRejectionPlaceholder')}
                  className="min-h-24"
                />
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setPaymentReviewDialogOpen(false)}>
              {t('submissionDocs.cancel')}
            </Button>
            <Button
              onClick={handlePaymentReview}
              className={paymentReviewStatus === "confirmed" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            >
              {paymentReviewStatus === "confirmed" ? t('submissionDocs.confirmPayment') : t('submissionDocs.rejectPayment')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
        <DialogContent dir={isRTL ? 'rtl' : 'ltr'} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('submissionDocs.reviewDialogTitle')}</DialogTitle>
            <DialogDescription>
              {selectedDocument?.originalName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('submissionDocs.statusLabel')}</label>
              <Select value={reviewStatus} onValueChange={(value: any) => setReviewStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="verified">{t('submissionDocs.statusVerified')}</SelectItem>
                  <SelectItem value="rejected">{t('submissionDocs.statusRejected')}</SelectItem>
                  <SelectItem value="needs_replacement">{t('submissionDocs.statusNeedsReplacement')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {reviewStatus === "rejected" && (
              <div className="space-y-2">
                <label className="text-sm font-semibold">{t('submissionDocs.rejectionReason')}</label>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder={t('submissionDocs.rejectionReasonPlaceholder')}
                  className="min-h-24"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('submissionDocs.notesLabel')}</label>
              <Textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder={t('submissionDocs.notesPlaceholder')}
                className="min-h-24"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              {t('submissionDocs.cancel')}
            </Button>
            <Button onClick={handleReview}>
              {reviewStatus === "verified" ? t('submissionDocs.approve') : t('submissionDocs.reject')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default SubmissionDocuments;
