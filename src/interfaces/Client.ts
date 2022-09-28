import { Gender } from "@core/utils/types";
import { SanityDefaultObject } from "src/interfaces/SanityDefaultInterfaces";


export default interface Client extends Partial<SanityDefaultObject> {
  _id: string;
  inactive?: boolean;
  clientNumber: number;
  name: string;
  phone?: string;
  email?: string;
  birthday?: Date;
  gender?: Gender;
  hearAboutUs?: string;
  cpf?: string;
  store: any;
  createdBy: any;
  address?: {
    street?: string
    number?: string
    complement?: string
    city?: string
    state?: string
    zipCode?: string
  };
}