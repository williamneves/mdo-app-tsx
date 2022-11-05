export default {
  title: "Metas",
  name: "goal",
  type: "document",
  fields: [
    {
      title: "Inactive",
      name: "inactive",
      type: "boolean",
      initialValue: false,
    },
    {
      title: "Deleted",
      name: "deleted",
      type: "boolean",
      initialValue: false,
    },
    {
      title: "Meta Principal?",
      name: "mainStoreGoal",
      type: "boolean",
      initialValue: false,
    },
    {
      title: "Goal Name",
      name: "name",
      type: "string",
    },
    {
      title: "Goal Description",
      name: "description",
      type: "string",
    },
    {
      title: "Período da Meta",
      name: "goalRange",
      type: "object",
      fields: [
        {
          title: "Data de Início",
          name: "dateStart",
          type: "date",
          options: {
            dateFormat: "DD/MM/YYYY",
          }
        },
        {
          title: "Data de Término",
          name: "dateEnd",
          type: "date",
          options: {
            dateFormat: "DD/MM/YYYY",
          }
        },
      ],
    },
    {
      title: "Tipo de Meta",
      name: "type",
      type: "string",
      options: {
        list: [
          { title: "Loja", value: "store" },
          { title: "Produto", value: "product" },
          { title: "Grupo", value: "group" },
          { title: "Individual", value: "individual" },
        ],
      }
    },
    {
      title: "Categoria",
      name: "category",
      type: "string",
      options: {
        list: [
          { title: "Metas Periódicas", value: "dateRangeGoals" },
          { title: "Metas Mensais", value: "monthlyGoals" },
          { title: "Metas Semanais", value: "weeklyGoals" },
          { title: "Metas Diárias", value: "dailyGoals" },
          { title: "Metas Especiais", value: "specialGoals" },

        ],
      }
    },
    {
      title: "Tabela de Referência",
      description: "Nome (_type) da tabela de referência",
      name: "typeReference",
      type: "string",
    },
    {
      title: "Key de Referência",
      name: "keyReferencePath",
      description: "Caminho para a key de referência",
      type: "string",
    },
    {
      title: "Valores Alvos",
      name: "targetValues",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              title: "Valor",
              name: "value",
              type: "number",
            },
            {
              title: "Descrição",
              name: "description",
              type: "string",
            }
          ],
        }
      ],
    },
    {
      title: "Lojas Alvo",
      name: "targetStores",
      type: "array",
      of: [{ type: "reference", to: [{ type: "store" }] }],
    },
  ]
}