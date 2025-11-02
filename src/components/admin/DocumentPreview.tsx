import { useEffect, useState } from "react";
import { X, ZoomIn, ZoomOut, RotateCw, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

interface DocumentPreviewProps {
  documentId: string | null;
  documentName: string;
  fileType: string;
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
}

export function DocumentPreview({
  documentId,
  documentName,
  fileType,
  isOpen,
  onClose,
  onDownload,
}: DocumentPreviewProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && documentId) {
      setIsLoading(true);
      setError(null);
      setZoom(100);
      setRotation(0);
      fetchDocument();
    }

    return () => {
      // Clean up object URL when component unmounts or document changes
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [isOpen, documentId]);

  const fetchDocument = async () => {
    if (!documentId) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/documents/${documentId}/preview`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(t('docPreview.loadError'));
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading document:', err);
      setError(t('docPreview.loadError'));
      setIsLoading(false);
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  if (!documentId) return null;

  const isImage = fileType.startsWith('image/');
  const isPDF = fileType === 'application/pdf';
  const isPreviewable = isImage || isPDF;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        dir={isRTL ? 'rtl' : 'ltr'}
        className="max-w-6xl h-[90vh] flex flex-col p-0"
      >
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg truncate flex-1 ml-4">
              {documentName}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {isPreviewable && isImage && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomOut}
                    disabled={zoom <= 50}
                    className="gap-2"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium min-w-12 text-center">
                    {zoom}%
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomIn}
                    disabled={zoom >= 300}
                    className="gap-2"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRotate}
                    className="gap-2"
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={onDownload}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                {t('docPreview.download')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto bg-muted/30 flex items-center justify-center p-6">
          {!isPreviewable ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-10 h-10 text-primary" />
              </div>
              <p className="text-foreground font-semibold mb-2">
                {t('docPreview.cannotPreview')}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {t('docPreview.fileType')}: {fileType}
              </p>
              <Button onClick={onDownload} className="gap-2">
                <Download className="w-4 h-4" />
                {t('docPreview.downloadFile')}
              </Button>
            </div>
          ) : (
            <>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                </div>
              )}
              {error && (
                <div className="text-center">
                  <p className="text-destructive font-semibold mb-2">{error}</p>
                  <Button onClick={onDownload} variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    {t('docPreview.downloadInstead')}
                  </Button>
                </div>
              )}
              {isPDF && !error && previewUrl && (
                <iframe
                  src={`${previewUrl}#toolbar=1`}
                  className="w-full h-full border-0 rounded-lg"
                  title={documentName}
                />
              )}
              {isImage && !error && previewUrl && (
                <div
                  className="transition-all duration-300"
                  style={{
                    transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                    maxWidth: '100%',
                    maxHeight: '100%',
                  }}
                >
                  <img
                    src={previewUrl}
                    alt={documentName}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
