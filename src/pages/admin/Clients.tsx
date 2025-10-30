import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Eye, Edit, Trash2, Phone, Mail, Download, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { clientsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Client {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  service: string;
  status: string;
  date: string;
  message: string;
  createdAt?: string;
}

const Clients = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterService, setFilterService] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 12;

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<{id: string, name: string} | null>(null);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const response = await clientsAPI.getAll({
        search: searchQuery || undefined,
        service: filterService !== "all" ? filterService : undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
        page: currentPage,
        limit: itemsPerPage,
      });

      if (response.success && response.data) {
        setClients(response.data);
        setTotalPages(response.totalPages || 1);
        setTotalCount(response.total || 0);
      }
    } catch (error: any) {
      console.error("Error fetching clients:", error);
      toast({
        title: "خطأ في تحميل البيانات",
        description: error.message || "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch clients when page changes
  useEffect(() => {
    fetchClients();
  }, [currentPage]);

  // Re-fetch when filters change and reset to page 1
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage === 1) {
        // If already on page 1, just fetch
        fetchClients();
      } else {
        // Otherwise, set to page 1 (which will trigger the other useEffect)
        setCurrentPage(1);
      }
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filterService, filterStatus]);

  const openDeleteDialog = (id: string, name: string) => {
    setClientToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!clientToDelete) return;

    try {
      const response = await clientsAPI.delete(clientToDelete.id);
      if (response.success) {
        toast({
          title: "تم الحذف بنجاح",
          description: `تم حذف العميل "${clientToDelete.name}"`,
        });
        setDeleteDialogOpen(false);
        setClientToDelete(null);
        fetchClients(); // Refresh the list
      }
    } catch (error: any) {
      console.error("Error deleting client:", error);
      toast({
        title: "خطأ في الحذف",
        description: error.message || "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  };

  // Clients are already filtered on server-side
  const filteredClients = clients;

  // Calculate pagination range
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalCount);

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

  const exportToCSV = async () => {
    try {
      setIsLoading(true);
      toast({
        title: "جاري تصدير البيانات...",
        description: "يرجى الانتظار",
      });

      // Fetch all clients without pagination
      const response = await clientsAPI.getAll({
        search: searchQuery || undefined,
        service: filterService !== "all" ? filterService : undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
        limit: 10000, // Get all clients
      });

      if (!response.success || !response.data || response.data.length === 0) {
        toast({
          title: "لا توجد بيانات للتصدير",
          description: "لا توجد عملاء مطابقة للفلاتر المحددة",
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
        "الرسالة",
        "التاريخ"
      ];

      // Convert data to CSV rows
      const csvRows = data.map((client: Client) => {
        return [
          client.name || "",
          client.email || "",
          client.phone || "",
          client.service || "",
          client.status || "",
          `"${(client.message || "").replace(/"/g, '""')}"`, // Escape quotes in message
          new Date(client.date || client.createdAt || "").toLocaleString('ar-EG')
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
      link.download = `clients_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "تم التصدير بنجاح",
        description: `تم تصدير ${data.length} عميل إلى ملف CSV`,
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
            <h2 className="text-3xl font-bold text-foreground">العملاء</h2>
            <p className="text-muted-foreground mt-1">
              إدارة جميع العملاء والطلبات ({totalCount} عميل)
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={exportToCSV} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              تصدير CSV
            </Button>
            <Button onClick={() => navigate("/admin/clients/add")} className="gap-2 bg-primary hover:bg-primary-dark">
              <Plus className="w-4 h-4" />
              إضافة عميل
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="ابحث بالاسم، البريد، أو الهاتف..."
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
                <SelectItem value="قيد المراجعة">قيد المراجعة</SelectItem>
                <SelectItem value="مكتمل">مكتمل</SelectItem>
                <SelectItem value="مرفوض">مرفوض</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Clients Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-right p-4 font-semibold text-foreground">العميل</th>
                  <th className="text-right p-4 font-semibold text-foreground">الخدمة</th>
                  <th className="text-right p-4 font-semibold text-foreground">الحالة</th>
                  <th className="text-right p-4 font-semibold text-foreground">التاريخ</th>
                  <th className="text-right p-4 font-semibold text-foreground">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center p-8">
                      <div className="flex justify-center items-center">
                        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                      </div>
                    </td>
                  </tr>
                ) : filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center p-8 text-muted-foreground">
                      لا توجد نتائج مطابقة للبحث
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client, index) => (
                    <tr
                      key={client._id}
                      className="border-b hover:bg-muted/30 transition-colors animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.03}s` }}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold flex-shrink-0">
                            {client.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-foreground">{client.name}</div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                              {client.email && (
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {client.email}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {client.phone}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-medium text-foreground">
                          {client.service}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(client.status)}`}>
                          {client.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-muted-foreground">
                          {new Date(client.date || client.createdAt || '').toLocaleDateString('ar-EG')}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="عرض التفاصيل"
                            onClick={() => navigate(`/admin/clients/${client._id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="تعديل"
                            onClick={() => navigate(`/admin/clients/${client._id}/edit`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="حذف"
                            onClick={() => openDeleteDialog(client._id, client.name)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Pagination */}
        {totalCount > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              عرض {startIndex} - {endIndex} من {totalCount} عميل
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                السابق
              </Button>

              {/* Page Numbers */}
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
                    onClick={() => setCurrentPage(pageNum)}
                    className={currentPage === pageNum ? "bg-primary text-white" : ""}
                  >
                    {pageNum}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                التالي
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent dir="rtl" className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف هذا العميل؟
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-900">
                سيتم حذف العميل <span className="font-bold">"{clientToDelete?.name}"</span> نهائياً. لا يمكن التراجع عن هذا الإجراء.
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
    </DashboardLayout>
  );
};

export default Clients;
