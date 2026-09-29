// Shared contract for outbound customer notifications (abandoned-cart
// reminders today; usable for order updates later). Same "stub now, real
// later" pattern as src/lib/payments/*.

export interface NotificationMessage {
  to: string; // email address or phone number (E.164 for WhatsApp)
  subject?: string; // used by email only
  body: string;
}

export interface NotificationResult {
  success: boolean;
  channel: "email" | "whatsapp";
  providerMessageId?: string;
  error?: string;
}

export interface NotificationChannel {
  channel: "email" | "whatsapp";
  send(message: NotificationMessage): Promise<NotificationResult>;
}
