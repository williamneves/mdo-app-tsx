export default {
  title: "Sale",
  name: "sale",
  type: "document",
  fields: [
    {
      title: "Sale Number",
      name: "saleNumber",
      type: "number",
      readOnly: true,
    },
    {
      title: "PDV Number",
      name: "PDVNumber",
      type: "string"
    },
    {
      title: "FeedBack de Auditoria",
      name: "auditFeedBack",
      type: "string"
    },
    {
      title: "Status de Auditoria",
      name: "auditStatus",
      type: "string",
      options: {
        list: [
          { title: "Pendente", value: "pending" },
          { title: "Aprovado", value: "approved" },
          { title: "Rejeitado", value: "rejected" },
        ],
        default: "pending",
      },
    },
    {
      title: "Cancelado",
      name: "canceled",
      type: "boolean",
    },
    {
      title: "Excluído pelo Usuário",
      name: "excluded",
      type: "boolean",
    },
    {
      title: "Date",
      name: "date",
      type: "date",
      options: {
        dateFormat: "DD/MM/YY",
      },
    },
    {
      title: "Client",
      name: "client",
      type: "reference",
      to: [{ type: "client" }],
    },
    {
      title: "Products",
      name: "products",
      type: "array",
      of: [
        {
          type: "object",
          preview: {
            select: {
              title: "product.title",
              price: "price",
            },
            prepare(value) {
              const { title, price } = value;
              return {
                title: `${title} - R$ ${price}`,
              };
            },
          },
          fields: [
            {
              title: "Product",
              name: "product",
              type: "reference",
              to: [
                {
                  type: "product",
                },
              ],
            },
            {
              title: "Price",
              name: "price",
              type: "number",
              validation: (Rule) => Rule.positive(),
            },
            {
              title: "Quantity",
              name: "quantity",
              type: "number",
              validation: (Rule) => [
                Rule.positive(),
                Rule.integer(),
                Rule.min(1),
                Rule.required(),
              ],
              initialValue: 1,
            },
            {
              title: "Discount",
              name: "discount",
              type: "number",
              validation: (Rule) => [Rule.positive()],
            },
            {
              title: "Cost",
              name: "cost",
              type: "number",
              validation: (Rule) => [Rule.positive()],
            },
          ],
        },
      ],
      preview: {
        select: {
          title: "product.title",
          subtitle: "price",
        },
      },
    },
    {
      title: "Payments",
      name: "salePayments",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              title: "Payment Method",
              name: "paymentMethod",
              type: "reference",
              to: [{ type: "paymentMethod" }],
            },
            {
              title: "Payment Amount",
              name: "paymentAmount",
              type: "number",
              validation: (Rule) => [Rule.positive()],
            },
            {
              title: "Split Quantity",
              name: "splitQuantity",
              type: "number",
            },
          ],
          preview: {
            select: {
              title: "paymentMethod.title",
              paymentAmount: "paymentAmount",
            },
            prepare(value) {
              const { title, paymentAmount } = value;
              return {
                title: `${title} - R$ ${paymentAmount}`,
              };
            },
          },
        },
      ],
    },
    {
      title: "Total Price",
      name: "totalPrice",
      type: "number",
    },
    {
      title: "Total Cost",
      name: "totalCost",
      type: "number",
      readOnly: true,
    },
    {
      title: "Total Discount",
      name: "totalDiscount",
      type: "number",
      readOnly: true,
    },
    {
      title: "Total Quantity",
      name: "totalQuantity",
      type: "number",
      readOnly: true,
    },
    {
      title: "Sale Amount",
      name: "saleAmount",
      type: "number",
      readOnly: true,
    },
    {
      title: "Lucro",
      name: "profit",
      type: "number",
      readOnly: true,
    },
    {
      title: "Markup",
      name: "markup",
      type: "number",
      readOnly: true,
    },
    {
      title: "Score",
      name: "score",
      type: "number",
      readOnly: true,
    },
    {
      title: "Payment Method",
      name: "paymentMethod",
      type: "reference",
      to: [
        {
          type: "paymentMethod",
        },
      ],
    },
    {
      title: "Split quantity",
      name: "splitQuantity",
      type: "number",
      validation: (Rule) => [
        Rule.positive(),
        Rule.integer(),
        Rule.min(1),
        Rule.max(24),
      ],
    },
    {
      title: "User",
      name: "user",
      type: "reference",
      to: [
        {
          type: "user",
        },
      ],
    },
    {
      title: "Store",
      name: "store",
      type: "reference",
      to: [
        {
          type: "store",
        },
      ],
    },
    {
      title: "Origin",
      name: "userReferrer",
      type: "array",
      of: [
        {
          type: "reference",
          to: [
            {
              type: "origin",
            },
          ],
        },
      ],
    },
    {
      title: "Schedule",
      name: "schedule",
      type: "boolean",
    },
    {
      title: "Schedule Discounted",
      name: "scheduleDiscount",
      type: "boolean",
    },
    {
      title: "Observations",
      name: "observations",
      type: "text",
    },
  ],
  preview: {
    select: {
      title: "saleAmount",
      subtitle: "date",
    },
  },
  orderings: [
    {
      title: "Data da venda",
      name: "saleDate",
      by: [
        {
          field: "date",
          direction: "desc",
        },
      ],
    },
    {
      title: "Valor da venda",
      name: "saleAmount",
      by: [
        {
          field: "saleAmount",
          direction: "desc",
        },
      ],
    },
  ],
};
