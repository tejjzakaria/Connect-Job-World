import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Eye, Trash2, Phone, Mail, MessageSquare, Download, CheckCircle, Clock, Link as LinkIcon, FileText, UserCheck, PhoneCall } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { submissionsAPI, documentsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

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
  validatedBy?: any;
  validatedAt?: string;
  callConfirmedBy?: any;
  callConfirmedAt?: string;
  callNotes?: string;
  convertedToClient?: boolean;
}

const Submissions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
        title: "خطأ في تحميل البيانات",
        description: error.message || "يرجى المحاولة مرة أخرى",
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
          title: "تم الحذف بنجاح",
          description: `تم حذف الطلب من "${submissionToDelete.name}"`,
        });
        setDeleteDialogOpen(false);
        setSubmissionToDelete(null);
        fetchSubmissions(); // Refresh the list
      }
    } catch (error: any) {
      console.error("Error deleting submission:", error);
      toast({
        title: "خطأ في الحذف",
        description: error.message || "يرجى المحاولة مرة أخرى",
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
          title: "تم التحقق بنجاح",
          description: "تم التحقق من البيانات",
        });
        fetchSubmissions();
      }
    } catch (error: any) {
      toast({
        title: "خطأ في التحقق",
        description: error.message || "يرجى المحاولة مرة أخرى",
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
          title: "تم تأكيد المكالمة",
          description: "تم تسجيل ملاحظات المكالمة بنجاح",
        });
        setCallDialogOpen(false);
        fetchSubmissions();
      }
    } catch (error: any) {
      toast({
        title: "خطأ في تأكيد المكالمة",
        description: error.message || "يرجى المحاولة مرة أخرى",
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
          title: "تم إنشاء الرابط",
          description: "تم إنشاء رابط رفع المستندات بنجاح",
        });
        fetchSubmissions();
      }
    } catch (error: any) {
      toast({
        title: "خطأ في إنشاء الرابط",
        description: error.message || "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    toast({
      title: "تم النسخ",
      description: "تم نسخ الرابط إلى الحافظة",
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
          title: "تم التحويل بنجاح",
          description: `تم تحويل "${submissionToConvert.name}" إلى عميل`,
        });
        setConvertDialogOpen(false);
        setSubmissionToConvert(null);
        fetchSubmissions();
      }
    } catch (error: any) {
      toast({
        title: "خطأ في التحويل",
        description: error.message || "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  };

  // Filtered submissions (now filtered on server-side)
  const filteredSubmissions = submissions;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "جديد":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "تمت المعاينة":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "تم التواصل":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "مكتمل":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "جديد":
        return <Clock className="w-3 h-3" />;
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
        title: "جاري تصدير البيانات...",
        description: "يرجى الانتظار",
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
          title: "لا توجد بيانات للتصدير",
          description: "لا توجد طلبات مطابقة للفلاتر المحددة",
          variant: "destructive"
        });
        return;
      }

      const data = response.data;

      // Define CSV headers
      const headers = [
        "الاسم",
        "البريد الإلكتروني",
        "رقم الهاتف",
        "الخدمة",
        "الحالة",
        "المصدر",
        "الرسالة",
        "التاريخ",
        "حالة سير العمل",
        "تم التحويل إلى عميل"
      ];

      // Convert data to CSV rows
      const csvRows = data.map((submission: Submission) => {
        return [
          submission.name || "",
          submission.email || "",
          submission.phone || "",
          submission.service || "",
          submission.status || "",
          submission.source || "",
          `"${(submission.message || "").replace(/"/g, '""')}"`, // Escape quotes in message
          new Date(submission.timestamp || submission.createdAt || "").toLocaleString('ar-EG'),
          submission.workflowStatus || "",
          submission.convertedToClient ? "نعم" : "لا"
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
      link.download = `submissions_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "تم التصدير بنجاح",
        description: `تم تصدير ${data.length} طلب إلى ملف CSV`,
      });
    } catch (error: any) {
      console.error("Error exporting to CSV:", error);
      toast({
        title: "خطأ في التصدير",
        description: error.message || "حدث خطأ أثناء تصدير البيانات",
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
            <h2 className="text-3xl font-bold text-foreground">الطلبات</h2>
            <p className="text-muted-foreground mt-1">
              جميع طلبات النموذج وواتساب ({filteredSubmissions.length} طلب)
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={exportToCSV} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              تصدير CSV
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
                <p className="text-sm text-muted-foreground">جديد</p>
                <p className="text-2xl font-bold text-foreground">
                  {submissions.filter(s => s.status === "جديد").length}
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
                <p className="text-sm text-muted-foreground">تمت المعاينة</p>
                <p className="text-2xl font-bold text-foreground">
                  {submissions.filter(s => s.status === "تمت المعاينة").length}
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
                <p className="text-sm text-muted-foreground">تم التواصل</p>
                <p className="text-2xl font-bold text-foreground">
                  {submissions.filter(s => s.status === "تم التواصل").length}
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
                <p className="text-sm text-muted-foreground">مكتمل</p>
                <p className="text-2xl font-bold text-foreground">
                  {submissions.filter(s => s.status === "مكتمل").length}
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
                placeholder="ابحث بالاسم، البريد، الهاتف، أو الرسالة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>

            {/* Service Filter */}
            <Select value={filterService} onValueChange={setFilterService}>
              <SelectTrigger>
                <Filter className="w-4 h-4 ml-2" />
                <SelectValue placeholder="جميع الخدمات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الخدمات</SelectItem>
                <SelectItem value="القرعة الأمريكية">القرعة الأمريكية</SelectItem>
                <SelectItem value="الهجرة إلى كندا">الهجرة إلى كندا</SelectItem>
                <SelectItem value="تأشيرة عمل">تأشيرة عمل</SelectItem>
                <SelectItem value="الدراسة في الخارج">الدراسة في الخارج</SelectItem>
                <SelectItem value="لم شمل العائلة">لم شمل العائلة</SelectItem>
                <SelectItem value="مواهب كرة القدم">مواهب كرة القدم</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <Filter className="w-4 h-4 ml-2" />
                <SelectValue placeholder="جميع الحالات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="جديد">جديد</SelectItem>
                <SelectItem value="تمت المعاينة">تمت المعاينة</SelectItem>
                <SelectItem value="تم التواصل">تم التواصل</SelectItem>
                <SelectItem value="مكتمل">مكتمل</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Source Filter */}
          <div className="mt-4">
            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger className="w-full md:w-64">
                <Filter className="w-4 h-4 ml-2" />
                <SelectValue placeholder="جميع المصادر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المصادر</SelectItem>
                <SelectItem value="نموذج الموقع">نموذج الموقع</SelectItem>
                <SelectItem value="واتساب">واتساب</SelectItem>
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
            <p className="text-muted-foreground">لا توجد نتائج مطابقة للبحث</p>
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
                        {submission.status}
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
                    {submission.service}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {submission.source}
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
                  {new Date(submission.timestamp || submission.createdAt || '').toLocaleString('ar-EG')}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  {/* Workflow Actions */}
                  {submission.workflowStatus === 'pending_validation' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 flex-1"
                      onClick={() => handleValidate(submission._id)}
                      title="تحقق من البيانات"
                    >
                      <UserCheck className="w-4 h-4" />
                      تحقق
                    </Button>
                  )}

                  {submission.workflowStatus === 'validated' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex-1"
                      onClick={() => openCallDialog(submission)}
                      title="تأكيد المكالمة"
                    >
                      <PhoneCall className="w-4 h-4" />
                      مكالمة
                    </Button>
                  )}

                  {(submission.workflowStatus === 'call_confirmed' || submission.workflowStatus === 'documents_requested') && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 flex-1"
                      onClick={() => handleGenerateLink(submission)}
                      title="إنشاء رابط رفع المستندات"
                    >
                      <LinkIcon className="w-4 h-4" />
                      رابط
                    </Button>
                  )}

                  {submission.workflowStatus === 'documents_verified' && !submission.convertedToClient && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 flex-1"
                      onClick={() => openConvertDialog(submission._id, submission.name)}
                      title="تحويل إلى عميل"
                    >
                      <UserCheck className="w-4 h-4" />
                      عميل
                    </Button>
                  )}

                  {/* View Documents */}
                  {(submission.workflowStatus === 'documents_uploaded' ||
                    submission.workflowStatus === 'documents_verified' ||
                    submission.workflowStatus === 'converted_to_client') && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 flex-1"
                      onClick={() => navigate(`/admin/submissions/${submission._id}/documents`)}
                      title="عرض المستندات"
                    >
                      <FileText className="w-4 h-4" />
                      مستندات
                    </Button>
                  )}

                  {/* Delete Action */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="حذف"
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
              عرض {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalCount)} من {totalCount} طلب
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                السابق
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
                التالي
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Call Confirmation Dialog */}
      <Dialog open={callDialogOpen} onOpenChange={setCallDialogOpen}>
        <DialogContent dir="rtl" className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>تأكيد المكالمة</DialogTitle>
            <DialogDescription>
              تأكيد المكالمة مع {selectedSubmission?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">ملاحظات المكالمة</label>
              <Textarea
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
                placeholder="أدخل ملاحظات حول المكالمة..."
                className="min-h-32"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCallDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleConfirmCall}>
              تأكيد المكالمة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generated Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent dir="rtl" className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>رابط رفع المستندات</DialogTitle>
            <DialogDescription>
              تم إنشاء الرابط بنجاح. يمكنك نسخه وإرساله للعميل
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">الرابط</label>
              <div className="flex gap-2">
                <Input
                  value={generatedLink}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button onClick={copyLinkToClipboard} variant="outline">
                  نسخ
                </Button>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
              <p className="font-semibold mb-2">معلومات الرابط:</p>
              <ul className="space-y-1">
                <li>• صالح لمدة 7 أيام</li>
                <li>• الحد الأقصى: 10 ملفات</li>
                <li>• يمكن إنشاء روابط إضافية عند الحاجة</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setLinkDialogOpen(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent dir="rtl" className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف هذا الطلب؟
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-900">
                سيتم حذف الطلب من <span className="font-bold">"{submissionToDelete?.name}"</span> نهائياً. لا يمكن التراجع عن هذا الإجراء.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Convert to Client Confirmation Dialog */}
      <Dialog open={convertDialogOpen} onOpenChange={setConvertDialogOpen}>
        <DialogContent dir="rtl" className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>تحويل إلى عميل</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من تحويل هذا الطلب إلى عميل؟
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                سيتم تحويل <span className="font-bold">"{submissionToConvert?.name}"</span> إلى عميل وإضافته إلى قائمة العملاء.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConvertDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleConvertConfirm}>
              تحويل إلى عميل
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Submissions;
