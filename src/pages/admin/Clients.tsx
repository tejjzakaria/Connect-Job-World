import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Eye, Edit, Trash2, Phone, Mail, Download, Plus, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { clientsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { formatDateForExport, formatDateForFilename, formatShortDate } from "@/lib/dateUtils";

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

// Helper function to get status translation from key (Client statuses)
const getStatusTranslation = (statusKey: string, t: any) => {
  const statusMap: Record<string, string> = {
    'new': t('status.new'),
    'in_review': t('status.inProgress'),
    'completed': t('status.completed'),
    'rejected': t('status.rejected'),
  };

  // Return translated value if key exists, otherwise return the original (for backwards compatibility)
  return statusMap[statusKey] || statusKey;
};

const Clients = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [searchQuery, setSearchQuery] = useState("");
  const [filterService, setFilterService] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

      // Performance monitoring - Start API call timer
      const apiStartTime = performance.now();

      const response = await clientsAPI.getAll({
        search: searchQuery || undefined,
        service: filterService !== "all" ? filterService : undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
        page: currentPage,
        limit: itemsPerPage,
      });

      // Performance monitoring - End API call timer
      const apiEndTime = performance.now();
      const apiDuration = apiEndTime - apiStartTime;

      if (response.success && response.data) {
        setClients(response.data);
        setTotalPages(response.totalPages || 1);
        setTotalCount(response.total || 0);

        // Performance monitoring - Log metrics
        console.log('📊 [Clients Performance Metrics]');
        console.log(`   API Response Time: ${apiDuration.toFixed(2)}ms`);
        console.log(`   Records Fetched: ${response.data.length}`);
        console.log(`   Total Records: ${response.total || 0}`);
        console.log(`   Page: ${currentPage}/${response.totalPages || 1}`);
        console.log(`   Throughput: ${((response.data.length / apiDuration) * 1000).toFixed(2)} records/sec`);
      }
    } catch (error: any) {
      console.error("Error fetching clients:", error);
      toast({
        title: t('dashboard.errorLoading'),
        description: error.message || t('dashboard.tryAgain'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch clients when page changes
  useEffect(() => {
    const renderStartTime = performance.now();
    fetchClients().then(() => {
      // Performance monitoring - Measure total render time
      requestAnimationFrame(() => {
        const renderEndTime = performance.now();
        const totalTime = renderEndTime - renderStartTime;
        console.log(`   Total Load Time (API + Render): ${totalTime.toFixed(2)}ms`);
      });
    });
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
          title: t('common.success'),
          description: t('clients.deleteSuccess', { name: clientToDelete.name, defaultValue: `Client "${clientToDelete.name}" deleted` }),
        });
        setDeleteDialogOpen(false);
        setClientToDelete(null);
        fetchClients(); // Refresh the list
      }
    } catch (error: any) {
      console.error("Error deleting client:", error);
      toast({
        title: t('common.error'),
        description: error.message || t('dashboard.tryAgain'),
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
      case "new":
      case "جديد":
        return "bg-blue-50 text-blue-700 border-blue-300";
      case "in_review":
      case "قيد المراجعة":
        return "bg-yellow-50 text-yellow-700 border-yellow-300";
      case "completed":
      case "مكتمل":
        return "bg-green-50 text-green-700 border-green-300";
      case "rejected":
      case "مرفوض":
        return "bg-red-50 text-red-700 border-red-300";
      default:
        return "bg-gray-50 text-gray-700 border-gray-300";
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await fetchClients();
      toast({
        title: t('common.refreshed', { defaultValue: 'Refreshed' }),
        description: t('clients.dataRefreshed', { defaultValue: 'Client data has been refreshed' }),
      });
    } catch (error) {
      console.error("Error refreshing clients:", error);
      toast({
        title: t('common.error', { defaultValue: 'Error' }),
        description: t('common.refreshError', { defaultValue: 'Failed to refresh data' }),
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const exportToCSV = async () => {
    try {
      setIsLoading(true);
      toast({
        title: t('common.exporting', { defaultValue: 'Exporting data...' }),
        description: t('common.pleaseWait', { defaultValue: 'Please wait' }),
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
          title: t('common.noDataToExport', { defaultValue: 'No data to export' }),
          description: t('clients.noMatchingClients', { defaultValue: 'No clients match the selected filters' }),
          variant: "destructive"
        });
        return;
      }

      const data = response.data;

      // Define CSV headers
      const headers = [
        t('clients.name'),
        t('clients.email'),
        t('clients.phone'),
        t('clients.service'),
        t('clients.status'),
        t('client.message'),
        t('submissions.date')
      ];

      // Convert data to CSV rows
      const csvRows = data.map((client: Client) => {
        return [
          client.name || "",
          client.email || "",
          client.phone || "",
          getServiceTranslation(client.service || "", t),
          client.status || "",
          `"${(client.message || "").replace(/"/g, '""')}"`, // Escape quotes in message
          formatDateForExport(client.date || client.createdAt || "")
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
      link.download = `clients_${formatDateForFilename()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: t('common.exportSuccess', { defaultValue: 'Export successful' }),
        description: t('clients.exportedCount', { count: data.length, defaultValue: `Exported ${data.length} clients to CSV` }),
      });
    } catch (error: any) {
      console.error("Error exporting to CSV:", error);
      toast({
        title: t('common.exportError', { defaultValue: 'Export error' }),
        description: error.message || t('common.exportErrorDesc', { defaultValue: 'An error occurred while exporting data' }),
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
            <h2 className="text-3xl font-bold text-foreground">{t('clients.title')}</h2>
            <p className="text-muted-foreground mt-1">
              {t('clients.manageAll', { count: totalCount, defaultValue: `Manage all clients and requests (${totalCount} clients)` })}
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleRefresh} variant="outline" className="gap-2" disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {t('common.refresh', { defaultValue: 'Refresh' })}
            </Button>
            <Button onClick={exportToCSV} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              {t('common.exportCSV', { defaultValue: 'Export CSV' })}
            </Button>
            <Button onClick={() => navigate("/admin/clients/add")} className="gap-2 bg-primary hover:bg-primary-dark">
              <Plus className="w-4 h-4" />
              {t('clients.addClient')}
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
                placeholder={t('clients.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>

            {/* Service Filter */}
            <Select value={filterService} onValueChange={setFilterService}>
              <SelectTrigger>
                <Filter className="w-4 h-4 ml-2" />
                <SelectValue placeholder={t('clients.filterByService')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('clients.allServices', { defaultValue: 'All Services' })}</SelectItem>
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
                <SelectValue placeholder={t('clients.filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('clients.allStatuses', { defaultValue: 'All Statuses' })}</SelectItem>
                <SelectItem value="جديد">{t('status.new')}</SelectItem>
                <SelectItem value="قيد المراجعة">{t('status.inProgress')}</SelectItem>
                <SelectItem value="مكتمل">{t('status.completed')}</SelectItem>
                <SelectItem value="مرفوض">{t('status.rejected')}</SelectItem>
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
                  <th className={`${isRTL ? 'text-right' : 'text-left'} p-4 font-semibold text-foreground`}>{t('clients.client', { defaultValue: 'Client' })}</th>
                  <th className={`${isRTL ? 'text-right' : 'text-left'} p-4 font-semibold text-foreground`}>{t('clients.service')}</th>
                  <th className={`${isRTL ? 'text-right' : 'text-left'} p-4 font-semibold text-foreground`}>{t('clients.status')}</th>
                  <th className={`${isRTL ? 'text-right' : 'text-left'} p-4 font-semibold text-foreground`}>{t('submissions.date')}</th>
                  <th className={`${isRTL ? 'text-right' : 'text-left'} p-4 font-semibold text-foreground`}>{t('clients.actions')}</th>
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
                      {t('clients.noResults', { defaultValue: 'No results match your search' })}
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client, index) => (
                    <tr
                      key={client._id}
                      className="border-b hover:bg-muted/30 transition-colors animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.03}s` }}
                    >
                      <td className={`${isRTL ? 'text-right' : 'text-left'} p-4`}>
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
                      <td className={`${isRTL ? 'text-right' : 'text-left'} p-4`}>
                        <span className="text-sm font-medium text-foreground">
                          {getServiceTranslation(client.service, t)}
                        </span>
                      </td>
                      <td className={`${isRTL ? 'text-right' : 'text-left'} p-4`}>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(client.status)}`}>
                          {getStatusTranslation(client.status, t)}
                        </span>
                      </td>
                      <td className={`${isRTL ? 'text-right' : 'text-left'} p-4`}>
                        <span className="text-sm text-muted-foreground">
                          {formatShortDate(client.date || client.createdAt || '')}
                        </span>
                      </td>
                      <td className={`${isRTL ? 'text-right' : 'text-left'} p-4`}>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title={t('common.view')}
                            onClick={() => navigate(`/admin/clients/${client._id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title={t('common.edit')}
                            onClick={() => navigate(`/admin/clients/${client._id}/edit`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            title={t('common.delete')}
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
              {t('clients.showing', { start: startIndex, end: endIndex, total: totalCount, defaultValue: `Showing ${startIndex} - ${endIndex} of ${totalCount} clients` })}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                {t('common.previous')}
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
                {t('common.next')}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent dir={isRTL ? 'rtl' : 'ltr'} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('clients.confirmDelete', { defaultValue: 'Confirm Delete' })}</DialogTitle>
            <DialogDescription>
              {t('clients.deleteConfirm')}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-900">
                {t('clients.deleteWarning', { name: clientToDelete?.name, defaultValue: `Client "${clientToDelete?.name}" will be permanently deleted. This action cannot be undone.` })}
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
    </DashboardLayout>
  );
};

export default Clients;
