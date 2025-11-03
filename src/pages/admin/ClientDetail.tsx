/**
 * ClientDetail.tsx
 *
 * Author: Zakaria TEJJANI
 * Email: contact@tejjzakaria.com
 * Date: 2025-11-03
 *
 * Description:
 * Detailed client view page displaying comprehensive information about a specific client.
 * Shows client profile with contact information, service details, status, appointment dates,
 * and complete message history. Provides action buttons for editing client information,
 * managing documents, and viewing activity timeline. Features a clean, organized layout
 * with status indicators and quick access to related functionality.
 */

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
import { formatShortDate } from "@/lib/dateUtils";
import { useTranslation } from "react-i18next";

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

const ClientDetail = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

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
        title: t('common.error'),
        description: error.message || "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const getDocStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
            <CheckCircle className="w-3 h-3" />
            {t('clientDetail.verified')}
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3" />
            {t('clientDetail.rejected')}
          </span>
        );
      case "needs_replacement":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">
            <AlertCircle className="w-3 h-3" />
            {t('clientDetail.needsReplacement')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3" />
            {t('clientDetail.underReview')}
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
          <p className="text-muted-foreground">{t('clientDetail.clientNotFound')}</p>
          <Button onClick={() => navigate("/admin/clients")} className="mt-4">
            {t('clientDetail.backToClients')}
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
              {t('common.back')}
            </Button>
            <div>
              <h2 className="text-3xl font-bold text-foreground">{client.name}</h2>
              <p className="text-muted-foreground mt-1">{t('clientDetail.title')}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => navigate(`/admin/clients/${clientId}/edit`)}
          >
            <Edit className="w-4 h-4" />
            {t('common.edit')}
          </Button>
        </div>

        {/* Client Info Card */}
        <Card className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Phone className="w-4 h-4" />
                <span>{t('clientDetail.phoneNumber')}</span>
              </div>
              <p className="font-semibold text-foreground">{client.phone}</p>
            </div>

            {client.email && (
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Mail className="w-4 h-4" />
                  <span>{t('clients.email')}</span>
                </div>
                <p className="font-semibold text-foreground truncate">{client.email}</p>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Briefcase className="w-4 h-4" />
                <span>{t('clients.service')}</span>
              </div>
              <p className="font-semibold text-foreground">{getServiceTranslation(client.service, t)}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Calendar className="w-4 h-4" />
                <span>{t('clientDetail.registrationDate')}</span>
              </div>
              <p className="font-semibold text-foreground">
                {formatShortDate(client.date || client.createdAt)}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">{t('clientDetail.status')}</h3>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                  client.status
                )}`}
              >
                {getStatusTranslation(client.status, t)}
              </span>
            </div>
          </div>

          {client.message && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-foreground mb-3">{t('clientDetail.message')}</h3>
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
              {t('clientDetail.documents')} ({documents.length})
            </h3>
            {submissionId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/admin/submissions/${submissionId}/documents`)}
              >
                {t('clientDetail.manageDocuments')}
              </Button>
            )}
          </div>

          {documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t('clientDetail.noDocuments')}</p>
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
                          {t(`docTypes.${document.documentType}`, document.documentType)}
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
                    {t('clientDetail.download')}
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
