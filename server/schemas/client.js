export default {
  title: "Client",
  name: "client",
  type: "document",
  preview: {
    select: {
      title: "name",
      subtitle: "store.name",
      clientNumber: "clientNumber",
    },
    prepare(value) {
      const { title, subtitle, clientNumber } = value;
      return {
        title: `${title} ${clientNumber ? `(${clientNumber})` : ""}`,
        subtitle: `${subtitle}`,
      };
    }
  },
  orderings: [
    {
      title: "Numero do cliente",
      name: "clientNumber",
      by: [
        {field: "clientNumber", direction: "desc"}
      ],
    },
  ],
  fields: [
    {
      title: "Inativado",
      name: "inactive",
      type: "boolean",
    },
    {
      title: "Código do Cliente",
      name: "clientNumber",
      type: "number",
      readOnly: true,
    },
    {
      title: "Name",
      name: "name",
      type: "string",
    },
    {
      title: "Phone",
      name: "phone",
      type: "string",
    },
    {
      title: "Email",
      name: "email",
      type: "string",
    },
    {
      title: "Birthday",
      name: "birthday",
      type: "date",
    },
    {
      title: "Gender",
      name: "gender",
      type: "string",
    },
    {
      title: "How did you hear about us?",
      name: "hearAboutUs",
      type: "string",
    },
    {
      title: "CPF",
      name: "cpf",
      type: "string",
    },
    {
      title: "Store",
      name: "store",
      type: "reference",
      to: [{ type: "store" }],
    },
    {
      title: "Created By",
      name: "createdBy",
      type: "reference",
      to: [{ type: "user" }],
    },
    {
      title: "Address",
      name: "address",
      type: "object",
      fields: [
        {
          title: "Street",
          name: "street",
          type: "string",
        },
        {
          title: "Number",
          name: "number",
          type: "string",
        },
        {
          title: "Complement",
          name: "complement",
          type: "string",
        },
        {
          title: "City",
          name: "city",
          type: "string",
        },
        {
          title: "State",
          name: "state",
          type: "string",
        },
        {
          title: "Zip Code",
          name: "zipCode",
          type: "string",
        },
      ],
    },
  ],
};
