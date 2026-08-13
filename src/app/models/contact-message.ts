export type MessageStatus = 'unread' | 'read' | 'replied';

export interface ContactMessage {
  id: string;
  userId?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  createdAt: string;
  repliedAt?: string;
  reply?: string;
}
