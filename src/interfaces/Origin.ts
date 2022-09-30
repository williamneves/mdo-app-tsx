import { SanityDefaultObject } from "src/interfaces/SanityDefaultInterfaces";

export default interface Origin extends Partial<SanityDefaultObject> {
  name: string;
  inactive: boolean;
  displayName: string;
}