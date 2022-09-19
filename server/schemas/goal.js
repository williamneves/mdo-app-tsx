export default {
  title: "Goal",
  name: "goal",
  type: "document",
  fields: [
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
      title: "Goal Date Start",
      name: "dateStart",
      type: "date",
      options: {
        dateFormat: "DD/MM/YY",
      }
    },
    {
      title: "Goal Date End",
      name: "dateEnd",
      type: "date",
      options: {
        dateFormat: "DD/MM/YY",
      }
    },
    {
      title: "Goal Type",
      name: "type",
      type: "string",
      options: {
        list: [
          { title: "Loja", value: "store" },
          { title: "Individual", value: "individual" },
        ],
      }
    },
    {
      title: "Goal Category",
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
      title: "Goal Target Field",
      name: "targetField",
      type: "string",
    },
    {
      title: "Goal Target Values",
      name: "targetValues",
      type: "array",
      of: [{ type: "string" || "number" }],
    },
    {
      title: "Goal Stores",
      name: "targetStores",
      type: "array",
      of: [{ type: "reference", to: [{ type: "store" }] }],
    },
  ]
}