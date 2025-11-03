/**
 * Employees.tsx
 *
 * Author: Zakaria TEJJANI
 * Email: contact@tejjzakaria.com
 * Date: 2025-11-03
 *
 * Description:
 * Employee management page for system user administration. Allows admins to create, edit,
 * and manage employee accounts with role-based access control (admin/agent/viewer).
 * Features include employee activation/deactivation, role management, search functionality,
 * and secure user account operations. Tracks employee information, last login times, and
 * account status. Implements proper authorization checks to ensure secure access control.
 */

import { useState, useEffect } from "react";
import { Search, Plus, Edit, UserX, UserCheck, Trash2, Mail, Shield, User } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { formatDate } from "@/lib/dateUtils";
import { usersAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

interface Employee {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "agent" | "viewer";
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

const Employees = () => {
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<{id: string, name: string} | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "viewer" as "admin" | "agent" | "viewer",
  });

  const [editFormData, setEditFormData] = useState({
    id: "",
    name: "",
    email: "",
    role: "viewer" as "admin" | "agent" | "viewer",
  });

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await usersAPI.getAll({
        search: searchQuery || undefined,
        role: filterRole !== "all" ? filterRole : undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
        page: currentPage,
        limit: itemsPerPage,
      });

      if (response.success && response.data) {
        setEmployees(response.data);
        setTotalPages(response.totalPages || 1);
        setTotalCount(response.total || 0);
      }
    } catch (error: any) {
      console.error("Error fetching employees:", error);
      toast({
        title: t('dashboard.errorLoading'),
        description: error.message || "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch employees when page changes
  useEffect(() => {
    fetchEmployees();
  }, [currentPage]);

  // Re-fetch when filters change and reset to page 1
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage === 1) {
        fetchEmployees();
      } else {
        setCurrentPage(1);
      }
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filterRole, filterStatus]);

  const handleCreateEmployee = async () => {
    try {
      if (!formData.name || !formData.email || !formData.password) {
        toast({
          title: t('common.error'),
          description: t('employees.errorFillRequired'),
          variant: "destructive"
        });
        return;
      }

      if (formData.password.length < 6) {
        toast({
          title: t('common.error'),
          description: t('employees.errorPasswordLength'),
          variant: "destructive"
        });
        return;
      }

      const response = await usersAPI.create(formData);

      if (response.success) {
        toast({
          title: t('common.success'),
          description: response.message || t('employees.successCreate'),
        });
        setCreateDialogOpen(false);
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "viewer",
        });
        fetchEmployees();
      }
    } catch (error: any) {
      console.error("Error creating employee:", error);
      toast({
        title: t('common.error'),
        description: error.message || t('employees.errorCreate'),
        variant: "destructive"
      });
    }
  };

  const handleEditEmployee = async () => {
    try {
      if (!editFormData.name || !editFormData.email) {
        toast({
          title: t('common.error'),
          description: t('employees.errorFillRequired'),
          variant: "destructive"
        });
        return;
      }

      const response = await usersAPI.update(editFormData.id, {
        name: editFormData.name,
        email: editFormData.email,
        role: editFormData.role,
      });

      if (response.success) {
        toast({
          title: t('common.success'),
          description: response.message || t('employees.successUpdate'),
        });
        setEditDialogOpen(false);
        fetchEmployees();
      }
    } catch (error: any) {
      console.error("Error updating employee:", error);
      toast({
        title: t('common.error'),
        description: error.message || t('employees.errorUpdate'),
        variant: "destructive"
      });
    }
  };

  const handleToggleActive = async (employee: Employee) => {
    try {
      const action = employee.isActive ? usersAPI.deactivate : usersAPI.activate;
      const response = await action(employee._id);

      if (response.success) {
        const action = employee.isActive ? t('employees.deactivated') : t('employees.activated');
        toast({
          title: t('common.success'),
          description: response.message || t('employees.successToggle', { action }),
        });
        fetchEmployees();
      }
    } catch (error: any) {
      console.error("Error toggling employee status:", error);
      toast({
        title: t('common.error'),
        description: error.message || t('employees.errorToggle'),
        variant: "destructive"
      });
    }
  };

  const handleDeleteEmployee = async () => {
    if (!employeeToDelete) return;

    try {
      const response = await usersAPI.delete(employeeToDelete.id);

      if (response.success) {
        toast({
          title: t('common.success'),
          description: t('employees.successDelete'),
        });
        setDeleteDialogOpen(false);
        setEmployeeToDelete(null);
        fetchEmployees();
      }
    } catch (error: any) {
      console.error("Error deleting employee:", error);
      toast({
        title: t('common.error'),
        description: error.message || t('employees.errorDelete'),
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (employee: Employee) => {
    setEditFormData({
      id: employee._id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (employee: Employee) => {
    setEmployeeToDelete({ id: employee._id, name: employee.name });
    setDeleteDialogOpen(true);
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      admin: { label: t('employees.roleAdmin'), className: "bg-red-500 hover:bg-red-600" },
      agent: { label: t('employees.roleAgent'), className: "bg-blue-500 hover:bg-blue-600" },
      viewer: { label: t('employees.roleViewer'), className: "bg-gray-500 hover:bg-gray-600" },
    };

    const variant = variants[role] || variants.viewer;
    return (
      <Badge className={`${variant.className} text-white`}>
        {variant.label}
      </Badge>
    );
  };

  // Pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-6" dir="ltr">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {t('employees.previous')}
        </Button>

        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
            >
              1
            </Button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {t('employees.next')}
        </Button>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{t('employees.title')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('employees.count', { count: totalCount, defaultValue: `${totalCount} employees` })}
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            {t('employees.addEmployee')}
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t('employees.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>

            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger>
                <SelectValue placeholder={t('employees.filterRole')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('employees.allRoles')}</SelectItem>
                <SelectItem value="admin">{t('employees.roleAdmin')}</SelectItem>
                <SelectItem value="agent">{t('employees.roleAgent')}</SelectItem>
                <SelectItem value="viewer">{t('employees.roleViewer')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder={t('employees.filterStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('employees.allStatuses')}</SelectItem>
                <SelectItem value="active">{t('employees.active')}</SelectItem>
                <SelectItem value="inactive">{t('employees.inactive')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Employees Table */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('employees.tableHeaderName')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('employees.tableHeaderEmail')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('employees.tableHeaderRole')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('employees.tableHeaderStatus')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('employees.tableHeaderLastLogin')}</TableHead>
                  <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('employees.tableHeaderActions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      {t('employees.loading')}
                    </TableCell>
                  </TableRow>
                ) : employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {t('employees.noEmployees')}
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((employee) => (
                    <TableRow key={employee._id}>
                      <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{employee.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {employee.email}
                        </div>
                      </TableCell>
                      <TableCell className={isRTL ? 'text-right' : 'text-left'}>{getRoleBadge(employee.role)}</TableCell>
                      <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                        <Badge variant={employee.isActive ? "default" : "secondary"}>
                          {employee.isActive ? t('employees.active') : t('employees.inactive')}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                        {formatDate(employee.lastLogin || "")}
                      </TableCell>
                      <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(employee)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(employee)}
                          >
                            {employee.isActive ? (
                              <UserX className="w-4 h-4 text-red-500" />
                            ) : (
                              <UserCheck className="w-4 h-4 text-green-500" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(employee)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Pagination */}
        {renderPagination()}

        {/* Create Employee Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent dir={isRTL ? 'rtl' : 'ltr'}>
            <DialogHeader>
              <DialogTitle>{t('employees.addEmployeeDialog')}</DialogTitle>
              <DialogDescription>
                {t('employees.addEmployeeDescription')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">{t('employees.name')}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('employees.namePlaceholder')}
                />
              </div>

              <div>
                <Label htmlFor="email">{t('employees.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t('employees.emailPlaceholder')}
                />
              </div>

              <div>
                <Label htmlFor="password">{t('employees.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={t('employees.passwordPlaceholder')}
                />
              </div>

              <div>
                <Label htmlFor="role">{t('employees.role')}</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: any) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">{t('employees.roleAdminDesc')}</SelectItem>
                    <SelectItem value="agent">{t('employees.roleAgentDesc')}</SelectItem>
                    <SelectItem value="viewer">{t('employees.roleViewerDesc')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleCreateEmployee}>
                {t('employees.create')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Employee Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent dir={isRTL ? 'rtl' : 'ltr'}>
            <DialogHeader>
              <DialogTitle>{t('employees.editEmployeeDialog')}</DialogTitle>
              <DialogDescription>
                {t('employees.editEmployeeDescription')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">{t('employees.name')}</Label>
                <Input
                  id="edit-name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  placeholder={t('employees.namePlaceholder')}
                />
              </div>

              <div>
                <Label htmlFor="edit-email">{t('employees.email')}</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  placeholder={t('employees.emailPlaceholder')}
                />
              </div>

              <div>
                <Label htmlFor="edit-role">{t('employees.role')}</Label>
                <Select
                  value={editFormData.role}
                  onValueChange={(value: any) => setEditFormData({ ...editFormData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">{t('employees.roleAdminDesc')}</SelectItem>
                    <SelectItem value="agent">{t('employees.roleAgentDesc')}</SelectItem>
                    <SelectItem value="viewer">{t('employees.roleViewerDesc')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleEditEmployee}>
                {t('common.save')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Employee Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent dir={isRTL ? 'rtl' : 'ltr'}>
            <DialogHeader>
              <DialogTitle>{t('employees.deleteEmployeeDialog')}</DialogTitle>
              <DialogDescription>
                {t('employees.deleteEmployeeDescription')} <strong>{employeeToDelete?.name}</strong>?
                <br />
                {t('employees.deleteEmployeeWarning')}
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button variant="destructive" onClick={handleDeleteEmployee}>
                {t('common.delete')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Employees;
