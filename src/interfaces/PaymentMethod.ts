import { SanityDefaultObject } from "src/interfaces/SanityDefaultInterfaces";


export default interface PaymentMethod extends Partial<SanityDefaultObject> {
  inactive: boolean;
  title: string;
  description: string;
  paymentType:
    "creditCard"
    | "debitCard"
    | "cash"
    | "installment"
    | "pix"
    | "ted"
    | "other";
  store: any;
  bankAccount: any;
}