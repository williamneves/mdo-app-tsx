type productCategory = "armacao-grau" | "oculos-solar" | "lente" | "outros"

import {SanityDefaultObject} from "./SanityDefaultInterfaces"

export default interface Product extends Partial<SanityDefaultObject> {
  inactive?: boolean
  name: string
  description?: string
  sku?: string
  category: productCategory
  store: any
}
