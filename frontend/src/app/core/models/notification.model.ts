export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ALERT';
  isRead: boolean;
  createdAt: string;
  referenceId?: string;
  referenceType?: string;
}
