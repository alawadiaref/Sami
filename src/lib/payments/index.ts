import { PaymentGateway, PaymentProvider } from "./types";
import { tabbyGateway } from "./tabby";
import { tamaraGateway } from "./tamara";
import { cardGateway } from "./card";
import { bankTransferGateway } from "./bank-transfer";

export * from "./types";

const gateways: Record<PaymentProvider, PaymentGateway> = {
  tabby: tabbyGateway,
  tamara: tamaraGateway,
  card: cardGateway,
  bank_transfer: bankTransferGateway,
};

export function getGateway(provider: PaymentProvider): PaymentGateway {
  return gateways[provider];
}
