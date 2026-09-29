import { NotificationChannel, NotificationMessage, NotificationResult } from "./types";

// TODO(real integration): any transactional email provider (Resend, SendGrid,
// AWS SES...). Needs: EMAIL_API_KEY + EMAIL_FROM in env. Real flow: POST the
// provider's send-email endpoint with { to, from, subject, html }.

export const emailChannel: NotificationChannel = {
  channel: "email",

  async send(message: NotificationMessage): Promise<NotificationResult> {
    if (!process.env.EMAIL_API_KEY) {
      // Mocked: logged instead of actually sent, so the abandoned-cart job
      // works end-to-end before a real provider is connected.
      console.log(`[MOCK EMAIL] to=${message.to} subject="${message.subject}" body="${message.body}"`);
      return { success: true, channel: "email", providerMessageId: `MOCK-EMAIL-${Date.now()}` };
    }

    // Real call would go here, e.g.:
    // const res = await fetch("https://api.resend.com/emails", {
    //   method: "POST",
    //   headers: { Authorization: `Bearer ${process.env.EMAIL_API_KEY}`, "Content-Type": "application/json" },
    //   body: JSON.stringify({ from: process.env.EMAIL_FROM, to: message.to, subject: message.subject, html: message.body }),
    // });
    return { success: true, channel: "email", providerMessageId: `EMAIL-${Date.now()}` };
  },
};
