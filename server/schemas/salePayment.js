export default {
  title: "Pagamento da Venda",
  name: "salePayment",
  type: "document",
  fields: [
    {
      title: "Forma de Pagamento",
      name: "paymentMethod",
      type: "reference",
      to: [{ type: "paymentMethod" }],
    },
    {
      title: "Valor",
      name: "paymentAmount",
      type: "number",
    },
    {
      title: "Parcelas",
      name: "splitQuantity",
      type: "number",
    },
    {
      title: "sale",
      name: "sale",
      type: "reference",
      to: [{ type: "sale" }],
    }
  ]
};