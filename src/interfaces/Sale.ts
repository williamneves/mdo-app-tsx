import AuthUser from "src/interfaces/authUser";
import PaymentMethod from "src/interfaces/PaymentMethod";
import Product from "src/interfaces/Product";
import Origin from "src/interfaces/Origin";
import { SanityDefaultObject } from "src/interfaces/SanityDefaultInterfaces";

interface Products {
  product: Partial<Product>;
  quantity: number;
  price: number;
  discount: number;
  cost: number;
}

export default interface Sale extends Partial<SanityDefaultObject> {
  _id: string;
  saleNumber: number;
  PDVNumber: string;
  auditStatus: "pending" | "approved" | "rejected";
  canceled: boolean;
  excluded: boolean;
  date: Date;
  client: any;
  products: Array<Products>;
  // Sale payments
  salePayments: Array<{
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
  user: Partial<AuthUser>;
  store: any;
  origin?: Array<Origin>;
  userReferrer?: Array<Origin>;
  schedule: boolean;
  scheduleDiscount: boolean;
  observations?: string;
}