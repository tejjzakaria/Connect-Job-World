/**
 * NotificationsDropdown.tsx
 *
 * Author: Zakaria TEJJANI
 * Email: contact@tejjzakaria.com
 * Date: 2025-11-03
 *
 * Description:
 * Real-time notifications dropdown component integrated into the admin dashboard header.
 * Displays unread notifications with badge counter, supports marking individual notifications
 * as read, bulk "mark all as read" functionality, and notification deletion. Shows notification
 * details including title, message, timestamp, and category icons (submissions, clients, system).
 * Implements auto-refresh polling for new notifications, visual indicators for unread status,
 * and clickable notifications that navigate to relevant pages. Features empty state messaging
 * when no notifications exist and smooth animations for dropdown interactions.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, CheckCheck, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { notificationsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { formatRelativeTime } from "@/lib/dateUtils";
import { useTranslation } from "react-i18next";

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export function NotificationsDropdown() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Poll for unread count
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await notificationsAPI.getAll({ limit: 10 });
      if (response.success && response.data) {
        setNotifications(response.data);
      }
    } catch (error: any) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationsAPI.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.count || 0);
      }
    } catch (error: any) {
      console.error("Error fetching unread count:", error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Mark as read if not already
      if (!notification.read) {
        await notificationsAPI.markAsRead(notification._id);
        setNotifications(prev =>
          prev.map(n =>
            n._id === notification._id ? { ...n, read: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      // Navigate if link exists
      if (notification.link) {
        setIsOpen(false);
        navigate(notification.link);
      }
    } catch (error: any) {
      console.error("Error handling notification click:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
      toast({
        title: t('notifications.success'),
        description: t('notifications.markAllReadSuccess'),
      });
    } catch (error: any) {
      toast({
        title: t('notifications.error'),
        description: t('notifications.markAllReadError'),
        variant: "destructive",
      });
    }
  };

  const handleClearRead = async () => {
    try {
      await notificationsAPI.clearRead();
      setNotifications(prev => prev.filter(n => !n.read));
      toast({
        title: t('notifications.success'),
        description: t('notifications.clearReadSuccess'),
      });
    } catch (error: any) {
      toast({
        title: t('notifications.error'),
        description: t('notifications.clearReadError'),
        variant: "destructive",
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_submission':
        return '📝';
      case 'converted_to_client':
        return '✅';
      case 'documents_uploaded':
        return '📎';
      case 'documents_verified':
        return '🔍';
      default:
        return '🔔';
    }
  };

  const getTranslatedNotification = (notification: Notification) => {
    const typeKey = `notifications.type.${notification.type}`;
    const hasTranslation = t(`${typeKey}.title`, { defaultValue: '' });

    // If translation exists for this type, use it
    if (hasTranslation) {
      // Map data fields to match translation keys
      const translationData: any = { ...(notification.data || {}) };

      // Map documentCount to count for translations
      if (translationData.documentCount !== undefined) {
        translationData.count = translationData.documentCount;
      }

      return {
        title: t(`${typeKey}.title`),
        message: t(`${typeKey}.message`, translationData),
      };
    }

    // Otherwise, fallback to database values
    return {
      title: notification.title,
      message: notification.message,
    };
  };


  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-[500px] overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-semibold text-foreground">{t('notifications.title')}</h3>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllRead}
                className="h-8 px-2 text-xs"
                title={t('notifications.markAllRead')}
              >
                <CheckCheck className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearRead}
              className="h-8 px-2 text-xs"
              title={t('notifications.clearRead')}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{t('notifications.noNotifications')}</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => {
              const { title, message } = getTranslatedNotification(notification);
              return (
                <DropdownMenuItem
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-3 cursor-pointer hover:bg-muted/50 ${
                    !notification.read ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 w-full">
                    <span className="text-2xl flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-sm text-foreground">
                          {title}
                        </p>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              );
            })}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
