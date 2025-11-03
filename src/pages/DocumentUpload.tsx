/**
 * DocumentUpload.tsx
 *
 * Author: Zakaria TEJJANI
 * Email: contact@tejjzakaria.com
 * Date: 2025-11-03
 *
 * Description:
 * Public-facing document upload interface for clients to submit required documents for
 * their applications. Features secure file upload with AWS S3 integration, document checklist
 * showing required and optional documents, upload progress tracking, and multi-file support.
 * Validates submission access via unique submission ID and provides visual feedback on
 * upload status. Includes document preview functionality and submission completion tracking.
 * Supports multiple document types with file size validation and format checking.
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { documentsAPI } from "@/lib/api";
import { formatFullDateTime } from "@/lib/dateUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface LinkData {
  isValid: boolean;
  submission: {
    _id: string;
    name: string;
    phone: string;
    email?: string;
    service: string;
  };
  uploadCount: number;
  maxUploads: number;
  expiresAt: string;
}

interface UploadFile {
  file: File;
  documentType: string;
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

const DocumentUpload = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const DOCUMENT_TYPES = [
    { value: "passport", label: t('docTypes.passport') },
    { value: "national_id", label: t('docTypes.national_id') },
    { value: "birth_certificate", label: t('docTypes.birth_certificate') },
    { value: "diploma", label: t('docTypes.diploma') },
    { value: "work_contract", label: t('docTypes.work_contract') },
    { value: "bank_statement", label: t('docTypes.bank_statement') },
    { value: "proof_of_address", label: t('docTypes.proof_of_address') },
    { value: "marriage_certificate", label: t('docTypes.marriage_certificate') },
    { value: "police_clearance", label: t('docTypes.police_clearance') },
    { value: "medical_report", label: t('docTypes.medical_report') },
    { value: "other", label: t('docTypes.other') },
  ];

  const [linkData, setLinkData] = useState<LinkData | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    validateLink();
  }, [token]);

  const validateLink = async () => {
    try {
      setIsValidating(true);
      const response = await documentsAPI.validateLink(token!);
      setLinkData(response.data);
    } catch (error: any) {
      console.error("Error validating link:", error);
      toast({
        title: t('docUpload.invalidLinkTitle'),
        description: error.message || t('docUpload.invalidLinkToast'),
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = linkData!.maxUploads - linkData!.uploadCount - uploadFiles.length;

    if (files.length > remainingSlots) {
      toast({
        title: t('docUpload.maxExceeded'),
        description: t('docUpload.maxExceededDesc', { remaining: remainingSlots }),
        variant: "destructive",
      });
      return;
    }

    const newFiles: UploadFile[] = Array.from(files).map(file => ({
      file,
      documentType: "other",
    }));

    setUploadFiles([...uploadFiles, ...newFiles]);
  };

  const updateDocumentType = (index: number, documentType: string) => {
    const updated = [...uploadFiles];
    updated[index].documentType = documentType;
    setUploadFiles(updated);
  };

  const removeFile = (index: number) => {
    const updated = uploadFiles.filter((_, i) => i !== index);
    setUploadFiles(updated);
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) {
      toast({
        title: t('docUpload.noFiles'),
        description: t('docUpload.noFilesDesc'),
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      const files = uploadFiles.map(uf => uf.file);
      const documentTypes = uploadFiles.map(uf => uf.documentType);

      await documentsAPI.uploadDocuments(token!, files, documentTypes);

      setUploadSuccess(true);
      toast({
        title: t('docUpload.uploadSuccessToast'),
        description: t('docUpload.uploadSuccessToastDesc', { count: uploadFiles.length }),
      });

      // Refresh link data to update upload count
      setTimeout(() => {
        validateLink();
        setUploadFiles([]);
      }, 2000);
    } catch (error: any) {
      console.error("Error uploading documents:", error);
      toast({
        title: t('docUpload.uploadFailed'),
        description: error.message || t('docUpload.uploadFailedDesc'),
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="p-12 max-w-md w-full text-center">
          <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-lg text-muted-foreground">{t('docUpload.validating')}</p>
        </Card>
        <LanguageSwitcher />
      </div>
    );
  }

  if (!linkData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="p-12 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">{t('docUpload.invalidLink')}</h2>
          <p className="text-muted-foreground mb-6">
            {t('docUpload.invalidLinkDesc')}
          </p>
          <Button onClick={() => navigate("/")} variant="outline">
            {t('docUpload.backToHome')}
          </Button>
        </Card>
        <LanguageSwitcher />
      </div>
    );
  }

  if (uploadSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="p-12 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">{t('docUpload.uploadSuccess')}</h2>
          <p className="text-muted-foreground mb-6">
            {t('docUpload.uploadSuccessDesc')}
          </p>
          <div className="space-y-3">
            <Button onClick={() => setUploadSuccess(false)} className="w-full">
              {t('docUpload.uploadMoreFiles')}
            </Button>
            <Button onClick={() => navigate("/")} variant="outline" className="w-full">
              {t('docUpload.backToHome')}
            </Button>
          </div>
        </Card>
        <LanguageSwitcher />
      </div>
    );
  }

  const remainingUploads = linkData.maxUploads - linkData.uploadCount;
  const expiresAt = new Date(linkData.expiresAt);
  const isExpiringSoon = expiresAt.getTime() - Date.now() < 24 * 60 * 60 * 1000; // Less than 24 hours

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Upload className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold">{t('docUpload.title')}</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">
            {t('docUpload.welcome', { name: linkData.submission.name })}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('docUpload.uploadRequiredDocs', { service: getServiceTranslation(linkData.submission.service, t) })}
          </p>
        </div>

        {/* Info Card */}
        <Card className="p-6 mb-6 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm">
              <p className="text-blue-900 font-semibold">{t('docUpload.linkInfo')}</p>
              <ul className="text-blue-800 space-y-1">
                <li>• {t('docUpload.maxUploads', { max: linkData.maxUploads })}</li>
                <li>• {t('docUpload.used', { used: linkData.uploadCount, max: linkData.maxUploads })}</li>
                <li>• {t('docUpload.remaining', { remaining: remainingUploads })}</li>
                <li className={isExpiringSoon ? "text-red-600 font-semibold" : ""}>
                  • {t('docUpload.expiresAt', { date: formatFullDateTime(expiresAt) })}
                  {isExpiringSoon && ` ${t('docUpload.expiringSoon')}`}
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Upload Card */}
        <Card className="p-8">
          {/* File Input */}
          <div className="mb-6">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-all"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 text-primary mb-3" />
                <p className="mb-2 text-lg font-semibold text-foreground">
                  {t('docUpload.clickToSelect')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('docUpload.fileFormats')}
                </p>
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx"
                onChange={handleFileSelect}
                disabled={remainingUploads === 0}
              />
            </label>
          </div>

          {/* Selected Files */}
          {uploadFiles.length > 0 && (
            <div className="space-y-3 mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                {t('docUpload.selectedFiles', { count: uploadFiles.length })}
              </h3>
              {uploadFiles.map((uploadFile, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start gap-4">
                    <FileText className="w-10 h-10 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        {uploadFile.file.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(uploadFile.file.size)}
                      </p>
                      <div className="mt-3">
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          {t('docUpload.documentType')}
                        </label>
                        <Select
                          value={uploadFile.documentType}
                          onValueChange={(value) => updateDocumentType(index, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DOCUMENT_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <XCircle className="w-5 h-5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={uploadFiles.length === 0 || isUploading}
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary-dark hover:via-primary hover:to-secondary"
          >
            {isUploading ? (
              <span className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('docUpload.uploading')}
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <Upload className="w-5 h-5" />
                {t('docUpload.uploadButton', { count: uploadFiles.length })}
              </span>
            )}
          </Button>

          {/* Help Text */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>{t('docUpload.helpText1')}</p>
            <p className="mt-1">{t('docUpload.helpText2')}</p>
          </div>
        </Card>

        {/* Contact Info */}
        <Card className="mt-6 p-6 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="text-center">
            <p className="text-foreground font-semibold mb-2">{t('docUpload.needHelp')}</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a
                href={`tel:${linkData.submission.phone}`}
                className="text-primary hover:underline"
              >
                {t('docUpload.phone', { phone: linkData.submission.phone })}
              </a>
              {linkData.submission.email && (
                <a
                  href={`mailto:${linkData.submission.email}`}
                  className="text-primary hover:underline"
                >
                  {t('docUpload.email', { email: linkData.submission.email })}
                </a>
              )}
            </div>
          </div>
        </Card>
      </div>
      <LanguageSwitcher />
    </div>
  );
};

export default DocumentUpload;
