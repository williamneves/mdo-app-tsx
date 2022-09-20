export default interface Product {
  inactive: boolean
  name: string
  description: string
  sku: string
  category: "armacao-grau" | "oculos-solar" | "lente" | "outros"
  store: any
}
