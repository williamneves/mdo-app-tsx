import AuthUser from "src/interfaces/authUser";
import PaymentMethod from "src/interfaces/PaymentMethod";
import Product from "src/interfaces/Product";
import { SanityDefaultObject } from "src/interfaces/SanityDefaultInterfaces";

export default interface Sale extends Partial<SanityDefaultObject> {
  _id: string;
  saleNumber: number;
  PDVNumber: number;
  auditStatus: "pending" | "approved" | "rejected";
  canceled: boolean;
  excluded: boolean;
  date: Date;
  client: any;
  products: Array<Partial<Product>>;
  salePayment: Array<{
    paymentMethod: PaymentMethod;
    paymentAmount: number
    splitQuantity: number
  }>;
  totalPrice: number;
  totalCost: number;
  totalDiscount: number;
  totalQuantity: number;
  saleAmount: number;
  profit: number;
  markup: number;
  score: number;
  paymentMethod: PaymentMethod;
  splitQuantity: number;
  user: AuthUser;
  store: any;
  origin?: Array<any>;
  schedule: boolean;
  scheduleDiscount: boolean;
  observations?: string;
}