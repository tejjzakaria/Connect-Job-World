import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Upload, CreditCard, CheckCircle, XCircle, AlertCircle, Loader2, Building2, Copy, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { paymentsAPI } from "@/lib/api";
import { formatFullDateTime } from "@/lib/dateUtils";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// ============================================================
// BANK ACCOUNTS CONFIGURATION
// Edit the bank accounts below to update payment details
// ============================================================
const BANK_ACCOUNTS: BankAccount[] = [
  {
    type: "bank",
    bankName: "Attijariwafa Bank",
    accountName: "ABDERRAFIK KHOUMCHAT",
    rib: "007010000710930040104668",
    swift: "BCMAMAMCXXX",
    logo: "/Logo_Attijari_bank.png",
  },
  {
    type: "bank",
    bankName: "Bank of Africa (BMCE)",
    accountName: "M ABDERRAFIK KHOUMCHAT",
    rib: "011010000007200001102049",
    swift: "BMCEMAMCXXX",
    logo: "/Bank_of_Africa_Logo.png",
  },
  {
    type: "bank",
    bankName: "CIH Bank",
    accountName: "LINA BADAOUI",
    rib: "230810564027821101580004",
    swift: "CIHMMAMC",
    logo: "/Cih-bank-logo.png",
  },
  {
    type: "cash",
    bankName: "Cash Plus",
    accountName: "LINA BADAOUI",
    phone: "07 64 72 46 08", // Add phone number here
    logo: "/cash-plus-mobile-logo.png",
  },
  {
    type: "cash",
    bankName: "Wafacash",
    accountName: "LINA BADAOUI",
    phone: "07 64 72 46 08", // Add phone number here
    logo: "/wafacash-logo.png",
  },
];
// ============================================================

interface BankAccount {
  type: "bank" | "cash";
  bankName: string;
  accountName: string;
  rib?: string;
  swift?: string;
  phone?: string;
  logo?: string;
}

interface PaymentLinkData {
  isValid: boolean;
  submission: {
    _id: string;
    name: string;
    phone: string;
    email?: string;
    service: string;
  };
  amount: number;
  currency: string;
  status: string;
  expiresAt: string;
  notes?: string;
  hasReceipt: boolean;
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

const PaymentUpload = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [linkData, setLinkData] = useState<PaymentLinkData | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    validateLink();
  }, [token]);

  const validateLink = async () => {
    try {
      setIsValidating(true);
      const response = await paymentsAPI.validateLink(token!);
      setLinkData(response.data);

      // If receipt already uploaded, show success state
      if (response.data.hasReceipt || response.data.status === 'receipt_uploaded') {
        setUploadSuccess(true);
      }
    } catch (error: any) {
      console.error("Error validating link:", error);
      toast({
        title: t('payment.invalidLinkTitle'),
        description: error.message || t('payment.invalidLinkToast'),
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: t('payment.fileTooLarge'),
        description: t('payment.fileTooLargeDesc'),
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: t('payment.noFile'),
        description: t('payment.noFileDesc'),
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      await paymentsAPI.uploadReceipt(token!, selectedFile);

      setUploadSuccess(true);
      toast({
        title: t('payment.uploadSuccessToast'),
        description: t('payment.uploadSuccessToastDesc'),
      });
    } catch (error: any) {
      console.error("Error uploading receipt:", error);
      toast({
        title: t('payment.uploadFailed'),
        description: error.message || t('payment.uploadFailedDesc'),
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t('payment.copied'),
      description: t('payment.copiedDesc', { label }),
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat(i18n.language === 'ar' ? 'ar-MA' : 'en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount) + ' ' + currency;
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="p-12 max-w-md w-full text-center">
          <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-lg text-muted-foreground">{t('payment.validating')}</p>
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
          <h2 className="text-2xl font-bold text-foreground mb-2">{t('payment.invalidLink')}</h2>
          <p className="text-muted-foreground mb-6">
            {t('payment.invalidLinkDesc')}
          </p>
          <Button onClick={() => navigate("/")} variant="outline">
            {t('payment.backToHome')}
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
          <h2 className="text-2xl font-bold text-foreground mb-2">{t('payment.uploadSuccess')}</h2>
          <p className="text-muted-foreground mb-6">
            {t('payment.uploadSuccessDesc')}
          </p>
          <div className="space-y-3">
            <Button onClick={() => navigate("/")} variant="outline" className="w-full">
              {t('payment.backToHome')}
            </Button>
          </div>
        </Card>
        <LanguageSwitcher />
      </div>
    );
  }

  const expiresAt = new Date(linkData.expiresAt);
  const isExpiringSoon = expiresAt.getTime() - Date.now() < 24 * 60 * 60 * 1000;

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <CreditCard className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold">{t('payment.title')}</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">
            {t('payment.welcome', { name: linkData.submission.name })}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('payment.completePayment', { service: getServiceTranslation(linkData.submission.service, t) })}
          </p>
        </div>

        {/* Amount Card */}
        <Card className="p-8 mb-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-2">{t('payment.amountToPay')}</p>
            <p className="text-5xl font-bold text-primary mb-4">
              {formatAmount(linkData.amount, linkData.currency)}
            </p>
            {linkData.notes && (
              <p className="text-sm text-muted-foreground bg-background/50 rounded-lg p-3 inline-block">
                {linkData.notes}
              </p>
            )}
          </div>
        </Card>

        {/* Payment Reference Disclaimer */}
        <Card className="p-6 mb-6 bg-amber-50 border-amber-300">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-amber-900 font-bold">{t('payment.importantNote')}</p>
              <p className="text-amber-800 text-sm">
                {t('payment.referenceDisclaimer')}
              </p>
              <div className="bg-amber-100 border border-amber-300 rounded-lg px-4 py-2 inline-block">
                <p className="text-amber-900 font-mono font-bold text-lg">SERVICE INF</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Bank Accounts Cards */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-foreground">{t('payment.bankDetails')}</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{t('payment.chooseBank')}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BANK_ACCOUNTS.map((bank, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b">
                {bank.logo ? (
                  <img
                    src={bank.logo}
                    alt={bank.bankName}
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                )}
                <h4 className="text-lg font-bold text-foreground">{bank.bankName}</h4>
              </div>

              <div className="space-y-3">
                {/* Account Name / Send To */}
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {bank.type === "cash" ? t('payment.sendTo') : t('payment.accountName')}
                    </p>
                    <p className="font-semibold text-foreground">{bank.accountName}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(bank.accountName, t('payment.accountName'))}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>

                {/* RIB - only for bank type */}
                {bank.type === "bank" && bank.rib && (
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground">{t('payment.rib')}</p>
                      <p className="font-semibold text-foreground font-mono text-sm">{bank.rib}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(bank.rib!, t('payment.rib'))}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* SWIFT - only for bank type */}
                {bank.type === "bank" && bank.swift && (
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground">{t('payment.swift')}</p>
                      <p className="font-semibold text-foreground font-mono">{bank.swift}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(bank.swift!, t('payment.swift'))}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* Phone - only for cash type */}
                {bank.type === "cash" && bank.phone && (
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground">{t('payment.phoneNumber')}</p>
                      <p className="font-semibold text-foreground font-mono">{bank.phone}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(bank.phone!, t('payment.phoneNumber'))}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
          </div>
        </div>

        

        {/* Info Card */}
        <Card className="p-6 mb-6 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm">
              <p className="text-blue-900 font-semibold">{t('payment.linkInfo')}</p>
              <ul className="text-blue-800 space-y-1">
                <li className={isExpiringSoon ? "text-red-600 font-semibold" : ""}>
                  {t('payment.expiresAt', { date: formatFullDateTime(expiresAt) })}
                  {isExpiringSoon && ` ${t('payment.expiringSoon')}`}
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Upload Card */}
        <Card className="p-8">
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Upload className="w-6 h-6 text-primary" />
            {t('payment.uploadReceipt')}
          </h3>

          {/* File Input */}
          <div className="mb-6">
            <label
              htmlFor="receipt-upload"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-all"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 text-primary mb-3" />
                <p className="mb-2 text-lg font-semibold text-foreground">
                  {t('payment.clickToSelect')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('payment.fileFormats')}
                </p>
              </div>
              <input
                id="receipt-upload"
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.gif"
                onChange={handleFileSelect}
              />
            </label>
          </div>

          {/* Selected File */}
          {selectedFile && (
            <div className="mb-6">
              <Card className="p-4">
                <div className="flex items-start gap-4">
                  <FileText className="w-10 h-10 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <XCircle className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary-dark hover:via-primary hover:to-secondary"
          >
            {isUploading ? (
              <span className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('payment.uploading')}
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <Upload className="w-5 h-5" />
                {t('payment.uploadButton')}
              </span>
            )}
          </Button>

          {/* Help Text */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>{t('payment.helpText1')}</p>
            <p className="mt-1">{t('payment.helpText2')}</p>
          </div>
        </Card>

        {/* Contact Info */}
        <Card className="mt-6 p-6 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="text-center">
            <p className="text-foreground font-semibold mb-2">{t('payment.needHelp')}</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a
                href="tel:+212661345678"
                className="text-primary hover:underline"
              >
                {t('payment.phone')}
              </a>
              <a
                href="mailto:contact@connectjobworld.com"
                className="text-primary hover:underline"
              >
                {t('payment.email')}
              </a>
            </div>
          </div>
        </Card>
      </div>
      <LanguageSwitcher />
    </div>
  );
};

export default PaymentUpload;
