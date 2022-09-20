type productCategory = "armacao-grau" | "oculos-solar" | "lente" | "outros"

export default interface Product {
  inactive?: boolean
  name: string
  description?: string
  sku?: string
  category: productCategory
  store: any
}
