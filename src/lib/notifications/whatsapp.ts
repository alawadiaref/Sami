import { NotificationChannel, NotificationMessage, NotificationResult } from "./types";

// TODO(real integration): WhatsApp Business Cloud API (Meta) or a BSP like
// Twilio. Needs: WHATSAPP_API_TOKEN + WHATSAPP_PHONE_ID in env. Real flow:
// POST https://graph.facebook.com/v19.0/{WHATSAPP_PHONE_ID}/messages with a
// template or free-form text message payload.

export const whatsappChannel: NotificationChannel = {
  channel: "whatsapp",

  async send(message: NotificationMessage): Promise<NotificationResult> {
    if (!process.env.WHATSAPP_API_TOKEN) {
      console.log(`[MOCK WHATSAPP] to=${message.to} body="${message.body}"`);
      return { success: true, channel: "whatsapp", providerMessageId: `MOCK-WA-${Date.now()}` };
    }

    // Real call would go here, e.g.:
    // const res = await fetch(`https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_ID}/messages`, {
    //   method: "POST",
    //   headers: { Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`, "Content-Type": "application/json" },
    //   body: JSON.stringify({ messaging_product: "whatsapp", to: message.to, type: "text", text: { body: message.body } }),
    // });
    return { success: true, channel: "whatsapp", providerMessageId: `WA-${Date.now()}` };
  },
};
