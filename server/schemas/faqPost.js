export default {
  title: "FAQ Post",
  name: "faqPost",
  type: "document",
  preview: {
    select: {
      title: "question",
      subtitle: "catetogy",
    }
  },
  fields: [
    {
      title: "Inactive",
      name: "inactive",
      type: "boolean",
      initialValue: false,
    },
    {
      title: "Question",
      name: "question",
      type: "string",
    },
    {
      title: "Description",
      name: "description",
      type: "string",
    },
    {
      title: "Thumbnail",
      name: "thumbnail",
      type: "image",
    },
    {
      title: "Answer",
      name: "answer",
      type: "array",
      of: [
        {
          type: "block",
        },
        {
          type: "image",
        }
        ],
    },
    {
      title: "Category",
      name: "category",
      type: "array",
      of: [
        {
          type: "string",
        },
      ],
      options: {
        list: [
          {title: "Vendedores", value: "vendedores"},
          {title: "Streets", value: "streets"},
          {title: "Gerais", value: "gerais"},
          {title: "Ajustes de Conta", value: "ajustesDeConta"},
          {title: "Clientes", value: "clientes"},
        ],
      },
    },
    {
      title: "Tags",
      name: "tags",
      type: "array",
      of: [{
        type: "string",
      }],
    },

  ],
}