import { Gender } from "@core/utils/types";
import { SanityDefaultObject } from "src/interfaces/SanityDefaultInterfaces";

export default interface User extends Partial<SanityDefaultObject> {
  _id: string;
  name: string;
  email: string;
  imageURL: string;
  imageAsset: any;
  role: "admin" | "manager" | "coordinator" | "vendor" | "streetVendor" | "client";
  profile: {
    jobTitle: string
    birthday?: Date
    gender?: Gender
    phoneNumbers?: string
    bio?: string
  };
}