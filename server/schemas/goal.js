export default {
  title: "Goal",
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
          type: "datetime",
          options: {
            dateFormat: "DD/MM/YYYY",
          }
        },
        {
          title: "Data de Término",
          name: "dateEnd",
          type: "datetime",
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
          { title: "Outro", value: "other" },
        ],
      }
    },
    {
      title: "Referência do Tipo de Meta",
      name: "targetField",
      type: "array",
      of: [{ type: "string", }],
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