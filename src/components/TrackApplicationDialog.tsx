/**
 * TrackApplicationDialog.tsx
 *
 * Author: Zakaria TEJJANI
 * Email: contact@tejjzakaria.com
 * Date: 2025-11-03
 *
 * Description:
 * Modal dialog component for application tracking accessible from the main header.
 * Provides quick search interface where clients can enter phone number or email to check
 * their submission status without leaving the current page. Displays results in dialog with
 * status indicators, service information, submission date, and contact details. Features
 * loading states, error handling, and links to document upload functionality. Implements
 * responsive design and smooth animations for seamless user experience. Supports multi-language
 * interface for international clients.
 */

import { useState } from "react";
import { Search, CheckCircle, Clock, FileText, Phone, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatShortDate } from "@/lib/dateUtils";
import { useTranslation } from "react-i18next";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

interface ApplicationData {
  name: string;
  phone: string;
  email?: string;
  service: string;
  status: string;
  workflowStatus?: string;
  timestamp: string;
  createdAt: string;
  documentStats: {
    total: number;
    verified: number;
  };
}

interface TrackApplicationDialogProps {
  isOpen: boolean;
  onClose: () => void;
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

  return serviceMap[serviceKey] || serviceKey;
};

// Helper function to get status translation from key
const getStatusTranslation = (statusKey: string, t: any) => {
  const statusMap: Record<string, string> = {
    'new': t('status.new'),
    'in_review': t('status.inProgress'),
    'completed': t('status.completed'),
    'rejected': t('status.rejected'),
  };

  return statusMap[statusKey] || statusKey;
};

export default function TrackApplicationDialog({ isOpen, onClose }: TrackApplicationDialogProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);

  const WORKFLOW_STAGES = [
    { id: 'pending_validation', label: t('workflow.pending_validation'), icon: Clock },
    { id: 'validated', label: t('workflow.validated'), icon: CheckCircle },
    { id: 'call_confirmed', label: t('workflow.call_confirmed'), icon: Phone },
    { id: 'documents_requested', label: t('workflow.documents_requested'), icon: FileText },
    { id: 'documents_uploaded', label: t('workflow.documents_uploaded'), icon: FileText },
    { id: 'documents_verified', label: t('workflow.documents_verified'), icon: CheckCircle },
    { id: 'converted_to_client', label: t('workflow.converted_to_client'), icon: CheckCircle },
  ];

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone && !email) {
      setError(t('trackApp.errorRequired'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/submissions/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || t('trackApp.errorNotFound'));
        setApplicationData(null);
        return;
      }

      setApplicationData(data.data);
      setError(null);
    } catch (err) {
      console.error('Error tracking application:', err);
      setError(t('trackApp.errorServer'));
      setApplicationData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentStageIndex = (workflowStatus?: string) => {
    if (!workflowStatus) return 0;
    const index = WORKFLOW_STAGES.findIndex(stage => stage.id === workflowStatus);
    return index >= 0 ? index : 0;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
      case "جديد":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "in_review":
      case "تمت المعاينة":
      case "تم التواصل":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "completed":
      case "مكتمل":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleClose = () => {
    setPhone("");
    setEmail("");
    setError(null);
    setApplicationData(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent dir={isRTL ? 'rtl' : 'ltr'} className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t('trackApp.title')}</DialogTitle>
          <DialogDescription>
            {t('trackApp.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Form */}
          <Card className="p-6">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                {t('trackApp.subtitle')}
              </h3>
            </div>

            <form onSubmit={handleTrack} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('trackApp.phoneLabel')}</label>
                  <div className="relative">
                    <Phone className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                    <Input
                      type="tel"
                      placeholder={t('trackApp.phonePlaceholder')}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={isRTL ? 'pr-10' : 'pl-10'}
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t('trackApp.emailLabel')} <span className="text-muted-foreground">{t('trackApp.emailOptional')}</span>
                  </label>
                  <div className="relative">
                    <Mail className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                    <Input
                      type="email"
                      placeholder={t('trackApp.emailPlaceholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={isRTL ? 'pr-10' : 'pl-10'}
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('trackApp.searching')}
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    {t('trackApp.trackButton')}
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Application Status */}
          {applicationData && (
            <div className="space-y-4 animate-fade-in">
              {/* User Info Card */}
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {applicationData.name}
                    </h3>
                    <p className="text-muted-foreground">{getServiceTranslation(applicationData.service, t)}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(applicationData.status)}`}>
                    {getStatusTranslation(applicationData.status, t)}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{applicationData.phone}</span>
                  </div>
                  {applicationData.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{applicationData.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">
                      {t('trackApp.submittedOn')}: {formatShortDate(applicationData.timestamp || applicationData.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">
                      {t('trackApp.documents')}: {t('trackApp.documentsVerified', { verified: applicationData.documentStats.verified, total: applicationData.documentStats.total })}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Progress Timeline */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-6">
                  {t('trackApp.processingStages')}
                </h3>

                <div className="space-y-4">
                  {WORKFLOW_STAGES.map((stage, index) => {
                    const currentIndex = getCurrentStageIndex(applicationData.workflowStatus);
                    const isCompleted = index <= currentIndex;
                    const isCurrent = index === currentIndex;
                    const Icon = stage.icon;

                    return (
                      <div key={stage.id} className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCompleted
                            ? 'bg-gradient-to-br from-primary to-accent text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>

                        {/* Content */}
                        <div className={`flex-1 pb-6 ${isRTL ? 'border-r-2 ml-5 pr-4' : 'border-l-2 mr-5 pl-4'} border-muted relative`}>
                          {index < WORKFLOW_STAGES.length - 1 && (
                            <div className={`absolute top-10 ${isRTL ? 'right-[-2px]' : 'left-[-2px]'} bottom-0 w-0.5 ${
                              isCompleted ? 'bg-primary' : 'bg-muted'
                            }`} />
                          )}
                          <div className={`${isCurrent ? 'font-bold' : ''}`}>
                            <h4 className={`font-semibold ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {stage.label}
                            </h4>
                            {isCurrent && (
                              <p className="text-sm text-primary mt-1">{t('trackApp.currentStage')}</p>
                            )}
                            {isCompleted && !isCurrent && (
                              <p className="text-sm text-green-600 mt-1">✓ {t('trackApp.completed')}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Info Card */}
              <Card className="p-6 bg-blue-50 border-blue-200">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">{t('trackApp.importantNote')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('trackApp.noteDescription')}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
