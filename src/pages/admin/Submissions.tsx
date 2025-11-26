import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Eye, Trash2, Phone, Mail, MessageSquare, Download, CheckCircle, Clock, Link as LinkIcon, FileText, UserCheck, PhoneCall, CreditCard, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { submissionsAPI, documentsAPI, paymentsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { formatDateForExport, formatDateForFilename, formatDateTime } from "@/lib/dateUtils";

interface Submission {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  service: string;
  message: string;
  status: string;
  timestamp: string;
  source: string;
  createdAt?: string;
  workflowStatus?: string;
  validatedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  validatedAt?: string;
  callConfirmedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  callConfirmedAt?: string;
  callNotes?: string;
  convertedToClient?: boolean;
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

// Helper function to get status translation from key
const getStatusTranslation = (statusKey: string, t: any) => {
  const statusMap: Record<string, string> = {
    'new': t('submissions.statusNew'),
    'viewed': t('submissions.statusViewed'),
    'contacted': t('submissions.statusContacted'),
    'completed': t('submissions.statusCompleted'),
  };

  // Return translated value if key exists, otherwise return the original (for backwards compatibility)
  return statusMap[statusKey] || statusKey;
};

// Helper function to get source translation from key
const getSourceTranslation = (sourceKey: string, t: any) => {
  const sourceMap: Record<string, string> = {
    'website': t('submissions.sourceWebsite'),
    'whatsapp': t('submissions.sourceWhatsApp'),
    'phone': t('submissions.sourcePhone'),
    'email': t('submissions.sourceEmail'),
  };

  // Return translated value if key exists, otherwise return the original (for backwards compatibility)
  return sourceMap[sourceKey] || sourceKey;
};

const Submissions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [searchQuery, setSearchQuery] = useState("");
  const [filterService, setFilterService] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 9;

  // Workflow dialogs state
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [callNotes, setCallNotes] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");

  // Payment dialog state
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentLinkDialogOpen, setPaymentLinkDialogOpen] = useState(false);
  const [generatedPaymentLink, setGeneratedPaymentLink] = useState("");

  // Confirmation dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState<{id: string, name: string} | null>(null);
  const [convertDialogOpen, setConvertDialogOpen] = useState(false);
  const [submissionToConvert, setSubmissionToConvert] = useState<{id: string, name: string} | null>(null);

  // Fetch submissions from MongoDB
  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      const response = await submissionsAPI.getAll({
        search: searchQuery || undefined,
        service: filterService !== "all" ? filterService : undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
        source: filterSource !== "all" ? filterSource : undefined,
        page: currentPage,
        limit: itemsPerPage,
      });

      if (response.success && response.data) {
        setSubmissions(response.data);
        setTotalPages(response.totalPages || 1);
        setTotalCount(response.total || 0);
      }
    } catch (error: any) {
      console.error("Error fetching submissions:", error);
      toast({
        title: t('dashboard.errorLoading'),
        description: error.message || t('dashboard.tryAgain'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Re-fetch when filters or page change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSubmissions();
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filterService, filterStatus, filterSource, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterService, filterStatus, filterSource]);

  const openDeleteDialog = (id: string, name: string) => {
    setSubmissionToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!submissionToDelete) return;

    try {
      const response = await submissionsAPI.delete(submissionToDelete.id);
      if (response.success) {
        toast({
          title: t('common.success'),
          description: t('submissions.deleteSuccess', { name: submissionToDelete.name, defaultValue: `Submission from "${submissionToDelete.name}" deleted` }),
        });
        setDeleteDialogOpen(false);
        setSubmissionToDelete(null);
        fetchSubmissions(); // Refresh the list
      }
    } catch (error: any) {
      console.error("Error deleting submission:", error);
      toast({
        title: t('common.error'),
        description: error.message || t('dashboard.tryAgain'),
        variant: "destructive"
      });
    }
  };

  // Workflow action handlers
  const handleValidate = async (id: string) => {
    try {
      const response = await submissionsAPI.validate(id);
      if (response.success) {
        toast({
          title: t('common.success'),
          description: t('submissions.validateSuccess'),
        });
        fetchSubmissions();
      }
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message || t('dashboard.tryAgain'),
        variant: "destructive"
      });
    }
  };

  const openCallDialog = (submission: Submission) => {
    setSelectedSubmission(submission);
    setCallNotes("");
    setCallDialogOpen(true);
  };

  const handleConfirmCall = async () => {
    if (!selectedSubmission) return;

    try {
      const response = await submissionsAPI.confirmCall(selectedSubmission._id, callNotes);
      if (response.success) {
        toast({
          title: t('common.success'),
          description: t('submissions.callSuccess'),
        });
        setCallDialogOpen(false);
        fetchSubmissions();
      }
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message || t('dashboard.tryAgain'),
        variant: "destructive"
      });
    }
  };

  const handleGenerateLink = async (submission: Submission) => {
    try {
      const response = await documentsAPI.generateLink({
        submissionId: submission._id,
        expiresInDays: 7,
        maxUploads: 10,
      });

      if (response.success && response.uploadUrl) {
        setGeneratedLink(response.uploadUrl);
        setLinkDialogOpen(true);
        toast({
          title: t('common.success'),
          description: t('submissions.linkSuccess'),
        });
        fetchSubmissions();
      }
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message || t('dashboard.tryAgain'),
        variant: "destructive"
      });
    }
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    toast({
      title: t('common.copied', { defaultValue: 'Copied' }),
      description: t('submissions.linkCopied'),
    });
  };

  // Payment link handlers
  const openPaymentDialog = (submission: Submission) => {
    setSelectedSubmission(submission);
    setPaymentAmount("");
    setPaymentDialogOpen(true);
  };

  const handleGeneratePaymentLink = async () => {
    if (!selectedSubmission || !paymentAmount) return;

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: t('common.error'),
        description: t('submissions.invalidAmount'),
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await paymentsAPI.generateLink({
        submissionId: selectedSubmission._id,
        amount,
        currency: 'MAD',
        expiresInDays: 7,
      });

      if (response.success && response.paymentUrl) {
        setGeneratedPaymentLink(response.paymentUrl);
        setPaymentDialogOpen(false);
        setPaymentLinkDialogOpen(true);
        toast({
          title: t('common.success'),
          description: t('submissions.paymentLinkSuccess'),
        });
        fetchSubmissions();
      }
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message || t('dashboard.tryAgain'),
        variant: "destructive"
      });
    }
  };

  const copyPaymentLinkToClipboard = () => {
    navigator.clipboard.writeText(generatedPaymentLink);
    toast({
      title: t('common.copied', { defaultValue: 'Copied' }),
      description: t('submissions.paymentLinkCopied'),
    });
  };

  const openConvertDialog = (id: string, name: string) => {
    setSubmissionToConvert({ id, name });
    setConvertDialogOpen(true);
  };

  const handleConvertConfirm = async () => {
    if (!submissionToConvert) return;

    try {
      const response = await submissionsAPI.convertToClient(submissionToConvert.id);
      if (response.success) {
        toast({
          title: t('common.success'),
          description: t('submissions.convertSuccess', { name: submissionToConvert.name }),
        });
        setConvertDialogOpen(false);
        setSubmissionToConvert(null);
        fetchSubmissions();
      }
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message || t('dashboard.tryAgain'),
        variant: "destructive"
      });
    }
  };

  // Filtered submissions (now filtered on server-side)
  const filteredSubmissions = submissions;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
      case "جديد":
        return "bg-blue-50 text-blue-700 border-blue-300";
      case "viewed":
      case "تمت المعاينة":
        return "bg-yellow-50 text-yellow-700 border-yellow-300";
      case "contacted":
      case "تم التواصل":
        return "bg-purple-50 text-purple-700 border-purple-300";
      case "completed":
      case "مكتمل":
        return "bg-green-50 text-green-700 border-green-300";
      default:
        return "bg-gray-50 text-gray-700 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
      case "جديد":
        return <Clock className="w-3 h-3" />;
      case "viewed":
      case "تمت المعاينة":
        return <Eye className="w-3 h-3" />;
      case "contacted":
      case "تم التواصل":
        return <Phone className="w-3 h-3" />;
      case "completed":
      case "مكتمل":
        return <CheckCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const exportToCSV = async () => {
    try {
      setIsLoading(true);
      toast({
        title: t('common.exporting', { defaultValue: 'Exporting data...' }),
        description: t('submissions.exportWait'),
      });

      // Fetch all submissions without pagination
      const response = await submissionsAPI.getAll({
        search: searchQuery || undefined,
        service: filterService !== "all" ? filterService : undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
        source: filterSource !== "all" ? filterSource : undefined,
        limit: 10000, // Get all submissions
      });

      if (!response.success || !response.data || response.data.length === 0) {
        toast({
          title: t('common.noDataToExport', { defaultValue: 'No data to export' }),
          description: t('submissions.noDataToExport'),
          variant: "destructive"
        });
        return;
      }

      const data = response.data;

      // Define CSV headers
      const headers = [
        t('submissions.csvHeaderName'),
        t('submissions.csvHeaderEmail'),
        t('submissions.csvHeaderPhone'),
        t('submissions.csvHeaderService'),
        t('submissions.csvHeaderStatus'),
        t('submissions.csvHeaderSource'),
        t('submissions.csvHeaderMessage'),
        t('submissions.csvHeaderDate'),
        t('submissions.csvHeaderWorkflowStatus'),
        t('submissions.csvHeaderConverted')
      ];

      // Convert data to CSV rows
      const csvRows = data.map((submission: Submission) => {
        return [
          submission.name || "",
          submission.email || "",
          submission.phone || "",
          getServiceTranslation(submission.service || "", t),
          submission.status || "",
          submission.source || "",
          `"${(submission.message || "").replace(/"/g, '""')}"`, // Escape quotes in message
          formatDateForExport(submission.timestamp || submission.createdAt || ""),
          submission.workflowStatus || "",
          submission.convertedToClient ? t('submissions.csvYes') : t('submissions.csvNo')
        ];
      });

      // Combine headers and rows
      const csvContent = [
        headers.join(","),
        ...csvRows.map(row => row.join(","))
      ].join("\n");

      // Add BOM for proper UTF-8 encoding in Excel
      const BOM = "\uFEFF";
      const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `submissions_${formatDateForFilename()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: t('common.exportSuccess', { defaultValue: 'Export successful' }),
        description: t('submissions.exportedCount', { count: data.length }),
      });
    } catch (error: any) {
      console.error("Error exporting to CSV:", error);
      toast({
        title: t('common.exportError', { defaultValue: 'Export error' }),
        description: error.message || t('submissions.exportError'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">{t('submissions.title')}</h2>
            <p className="text-muted-foreground mt-1">
              {t('submissions.manageAll', { count: filteredSubmissions.length, defaultValue: `All form and WhatsApp submissions (${filteredSubmissions.length} submissions)` })}
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={exportToCSV} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              {t('common.exportCSV', { defaultValue: 'Export CSV' })}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-100">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('submissions.statusNew')}</p>
                <p className="text-2xl font-bold text-foreground">
                  {submissions.filter(s => s.status === t('submissions.statusNew')).length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-yellow-100">
                <Eye className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('submissions.statusViewed')}</p>
                <p className="text-2xl font-bold text-foreground">
                  {submissions.filter(s => s.status === t('submissions.statusViewed')).length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-100">
                <Phone className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('submissions.statusContacted')}</p>
                <p className="text-2xl font-bold text-foreground">
                  {submissions.filter(s => s.status === t('submissions.statusContacted')).length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-100">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('submissions.statusCompleted')}</p>
                <p className="text-2xl font-bold text-foreground">
                  {submissions.filter(s => s.status === t('submissions.statusCompleted')).length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={t('submissions.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>

            {/* Service Filter */}
            <Select value={filterService} onValueChange={setFilterService}>
              <SelectTrigger>
                <Filter className="w-4 h-4 ml-2" />
                <SelectValue placeholder={t('submissions.allServices')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('submissions.allServices')}</SelectItem>
                <SelectItem value="us_lottery">{t('submissions.serviceUSLottery')}</SelectItem>
                <SelectItem value="canada_immigration">{t('submissions.serviceCanadaImmigration')}</SelectItem>
                <SelectItem value="work_visa">{t('submissions.serviceWorkVisa')}</SelectItem>
                <SelectItem value="study_abroad">{t('submissions.serviceStudyAbroad')}</SelectItem>
                <SelectItem value="family_reunion">{t('submissions.serviceFamilyReunion')}</SelectItem>
                <SelectItem value="soccer_talent">{t('submissions.serviceSoccerTalent')}</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <Filter className="w-4 h-4 ml-2" />
                <SelectValue placeholder={t('submissions.allStatuses')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('submissions.allStatuses')}</SelectItem>
                <SelectItem value={t('submissions.statusNew')}>{t('submissions.statusNew')}</SelectItem>
                <SelectItem value={t('submissions.statusViewed')}>{t('submissions.statusViewed')}</SelectItem>
                <SelectItem value={t('submissions.statusContacted')}>{t('submissions.statusContacted')}</SelectItem>
                <SelectItem value={t('submissions.statusCompleted')}>{t('submissions.statusCompleted')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Source Filter */}
          <div className="mt-4">
            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger className="w-full md:w-64">
                <Filter className="w-4 h-4 ml-2" />
                <SelectValue placeholder={t('submissions.allSources')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('submissions.allSources')}</SelectItem>
                <SelectItem value={t('submissions.sourceWebsite')}>{t('submissions.sourceWebsite')}</SelectItem>
                <SelectItem value={t('submissions.sourceWhatsApp')}>{t('submissions.sourceWhatsApp')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Submissions List */}
        {isLoading ? (
          <Card className="p-12 text-center">
            <div className="flex justify-center items-center">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          </Card>
        ) : filteredSubmissions.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t('submissions.noResults')}</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSubmissions.map((submission, index) => (
              <Card
                key={submission._id}
                className="p-6 hover:shadow-lg transition-all animate-fade-in-up border-2 hover:border-primary/30 flex flex-col"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {submission.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-foreground truncate">{submission.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(submission.status)}`}>
                        {getStatusIcon(submission.status)}
                        {getStatusTranslation(submission.status, t)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{submission.phone}</span>
                  </div>
                  {submission.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{submission.email}</span>
                    </div>
                  )}
                </div>

                {/* Service & Source */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-medium">
                    {getServiceTranslation(submission.service, t)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {getSourceTranslation(submission.source, t)}
                  </span>
                </div>

                {/* Message */}
                <div className="bg-muted/50 rounded-lg p-3 mb-4 flex-1">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground leading-relaxed line-clamp-3">{submission.message}</p>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {t('submissions.submittedAt')}: {formatDateForExport(submission.timestamp || submission.createdAt || '')}
                </div>

                {/* Audit Trail */}
                {(submission.validatedBy || submission.callConfirmedBy) && (
                  <div className="space-y-2 mb-4">
                    {submission.validatedBy && submission.validatedAt && (
                      <div className="bg-green-50 border border-green-200 rounded p-2 text-xs">
                        <p className="font-semibold text-green-900">✓ {t('submissions.validatedLabel')}</p>
                        <p className="text-green-800">
                          {t('submissions.validatedBy')}: {submission.validatedBy.name} • {formatDateTime(submission.validatedAt)}
                        </p>
                      </div>
                    )}
                    {submission.callConfirmedBy && submission.callConfirmedAt && (
                      <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs">
                        <p className="font-semibold text-blue-900">📞 {t('submissions.contactedLabel')}</p>
                        <p className="text-blue-800">
                          {t('submissions.validatedBy')}: {submission.callConfirmedBy.name} • {formatDateTime(submission.callConfirmedAt)}
                        </p>
                        {submission.callNotes && (
                          <p className="text-blue-700 mt-1 italic">{t('submissions.notesLabel')}: {submission.callNotes}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  {/* Workflow Actions */}
                  {submission.workflowStatus === 'pending_validation' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 flex-1"
                      onClick={() => handleValidate(submission._id)}
                      title={t('submissions.validateTooltip')}
                    >
                      <UserCheck className="w-4 h-4" />
                      {t('submissions.validateButton')}
                    </Button>
                  )}

                  {submission.workflowStatus === 'validated' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex-1"
                      onClick={() => openCallDialog(submission)}
                      title={t('submissions.callTooltip')}
                    >
                      <PhoneCall className="w-4 h-4" />
                      {t('submissions.callButton')}
                    </Button>
                  )}

                  {/* Payment Link Button - appears after call confirmed */}
                  {(submission.workflowStatus === 'call_confirmed' || submission.workflowStatus === 'payment_requested') && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 flex-1"
                      onClick={() => openPaymentDialog(submission)}
                      title={t('submissions.paymentTooltip')}
                    >
                      <DollarSign className="w-4 h-4" />
                      {t('submissions.paymentButton')}
                    </Button>
                  )}

                  {/* Verify Payment Button - appears when receipt is uploaded */}
                  {submission.workflowStatus === 'payment_uploaded' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 flex-1"
                      onClick={() => navigate(`/admin/submissions/${submission._id}/documents?tab=payment`)}
                      title={t('submissions.verifyPaymentTooltip')}
                    >
                      <CreditCard className="w-4 h-4" />
                      {t('submissions.verifyPaymentButton')}
                    </Button>
                  )}

                  {/* Document Upload Link Button - appears after payment confirmed */}
                  {(submission.workflowStatus === 'payment_confirmed' || submission.workflowStatus === 'documents_requested') && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 flex-1"
                      onClick={() => handleGenerateLink(submission)}
                      title={t('submissions.linkTooltip')}
                    >
                      <LinkIcon className="w-4 h-4" />
                      {t('submissions.linkButton')}
                    </Button>
                  )}

                  {submission.workflowStatus === 'documents_verified' && !submission.convertedToClient && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 flex-1"
                      onClick={() => openConvertDialog(submission._id, submission.name)}
                      title={t('submissions.clientTooltip')}
                    >
                      <UserCheck className="w-4 h-4" />
                      {t('submissions.clientButton')}
                    </Button>
                  )}

                  {/* View Documents */}
                  {(submission.workflowStatus === 'payment_uploaded' ||
                    submission.workflowStatus === 'payment_confirmed' ||
                    submission.workflowStatus === 'documents_requested' ||
                    submission.workflowStatus === 'documents_uploaded' ||
                    submission.workflowStatus === 'documents_verified' ||
                    submission.workflowStatus === 'converted_to_client') && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 flex-1"
                      onClick={() => navigate(`/admin/submissions/${submission._id}/documents`)}
                      title={t('submissions.documentsTooltip')}
                    >
                      <FileText className="w-4 h-4" />
                      {t('submissions.documentsButton')}
                    </Button>
                  )}

                  {/* Delete Action */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    title={t('submissions.deleteTooltip')}
                    onClick={() => openDeleteDialog(submission._id, submission.name)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredSubmissions.length > 0 && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {t('submissions.showing', {
                from: ((currentPage - 1) * itemsPerPage) + 1,
                to: Math.min(currentPage * itemsPerPage, totalCount),
                total: totalCount
              })}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                {t('submissions.previous')}
              </Button>

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant="outline"
                    size="sm"
                    className={currentPage === pageNum ? "bg-primary text-white" : ""}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                {t('submissions.next')}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Call Confirmation Dialog */}
      <Dialog open={callDialogOpen} onOpenChange={setCallDialogOpen}>
        <DialogContent dir={isRTL ? 'rtl' : 'ltr'} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('submissions.callDialogTitle')}</DialogTitle>
            <DialogDescription>
              {t('submissions.callDialogDescription', { name: selectedSubmission?.name })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('submissions.callNotesLabel')}</label>
              <Textarea
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
                placeholder={t('submissions.callNotesPlaceholder')}
                className="min-h-32"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCallDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleConfirmCall}>
              {t('submissions.confirmCallButton')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generated Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent dir={isRTL ? 'rtl' : 'ltr'} className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('submissions.linkDialogTitle')}</DialogTitle>
            <DialogDescription>
              {t('submissions.linkDialogDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('submissions.linkLabel')}</label>
              <div className="flex gap-2">
                <Input
                  value={generatedLink}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button onClick={copyLinkToClipboard} variant="outline">
                  {t('submissions.copyButton')}
                </Button>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
              <p className="font-semibold mb-2">{t('submissions.linkInfoTitle')}</p>
              <ul className="space-y-1">
                <li>{t('submissions.linkValidDays')}</li>
                <li>{t('submissions.linkMaxFiles')}</li>
                <li>{t('submissions.linkAdditional')}</li>
              </ul>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button onClick={() => setLinkDialogOpen(false)}>
              {t('common.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent dir={isRTL ? 'rtl' : 'ltr'} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('submissions.deleteDialogTitle')}</DialogTitle>
            <DialogDescription>
              {t('submissions.deleteDialogDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-900">
                {t('submissions.deleteWarning', { name: submissionToDelete?.name })}
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Convert to Client Confirmation Dialog */}
      <Dialog open={convertDialogOpen} onOpenChange={setConvertDialogOpen}>
        <DialogContent dir={isRTL ? 'rtl' : 'ltr'} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('submissions.convertDialogTitle')}</DialogTitle>
            <DialogDescription>
              {t('submissions.convertDialogDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                {t('submissions.convertWarning', { name: submissionToConvert?.name })}
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConvertDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleConvertConfirm}>
              {t('submissions.convertConfirmButton')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Amount Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent dir={isRTL ? 'rtl' : 'ltr'} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('submissions.paymentDialogTitle')}</DialogTitle>
            <DialogDescription>
              {t('submissions.paymentDialogDescription', { name: selectedSubmission?.name })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('submissions.paymentAmountLabel')}</label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder={t('submissions.paymentAmountPlaceholder')}
                  className="flex-1"
                  min="0"
                  step="0.01"
                />
                <span className="text-muted-foreground font-semibold">MAD</span>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleGeneratePaymentLink} disabled={!paymentAmount}>
              {t('submissions.generatePaymentLink')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generated Payment Link Dialog */}
      <Dialog open={paymentLinkDialogOpen} onOpenChange={setPaymentLinkDialogOpen}>
        <DialogContent dir={isRTL ? 'rtl' : 'ltr'} className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('submissions.paymentLinkDialogTitle')}</DialogTitle>
            <DialogDescription>
              {t('submissions.paymentLinkDialogDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">{t('submissions.paymentLinkLabel')}</label>
              <div className="flex gap-2">
                <Input
                  value={generatedPaymentLink}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button onClick={copyPaymentLinkToClipboard} variant="outline">
                  {t('submissions.copyButton')}
                </Button>
              </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm text-emerald-900">
              <p className="font-semibold mb-2">{t('submissions.paymentLinkInfoTitle')}</p>
              <ul className="space-y-1">
                <li>{t('submissions.paymentLinkValidDays')}</li>
                <li>{t('submissions.paymentLinkBankDetails')}</li>
                <li>{t('submissions.paymentLinkReceipt')}</li>
              </ul>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button onClick={() => setPaymentLinkDialogOpen(false)}>
              {t('common.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Submissions;
