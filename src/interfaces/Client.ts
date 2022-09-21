import { Gender } from "@core/utils/types";

export default interface Client {
  inactive?: boolean;
  clientNumber: number;
  name: string;
  phone?: string;
  email?: string;
  birthDay?: Date;
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
  _createdAt: Date;
  _updatedAt: Date;
}