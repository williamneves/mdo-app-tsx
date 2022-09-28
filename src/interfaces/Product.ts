type productCategory = "armacao-grau" | "oculos-solar" | "lente" | "outros"

import { SanityDefaultReference, SanityDefaultObject } from "src/interfaces/SanityDefaultInterfaces";

export default interface Product extends Partial<SanityDefaultObject> {
  inactive?: boolean;
  title: string;
  description?: string;
  sku?: string;
  category: productCategory;
  store: SanityDefaultReference;
}
