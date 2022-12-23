export default {
    title: "Manager Report",
    name: "managerReport",
    type: "document",
    preview: {
        select: {
            title: "date",
            subtitle: "valueInCash",
        }
    },
    fields: [
        {
            title: "Valor em caixa",
            name: "valueInCash",
            type: "number",
        },
        {
            title: "Data",
            name: "date",
            type: "date",
            options: {
                dateFormat: "DD/MM/YY",
            }
        },
        {
            title: "Decrição do dia",
            name: "dayDescription",
            type: "string",
        },
        {
            title: "Planejamento para o dia seguinte",
            name: "nextDayPlanning",
            type: "string",
        },
        {
            title: "Vendas Aprovadas",
            name: "approvedSales",
            type: "array",
            of: [{
                type: "reference",
                to: [{type: "sale"}],
            }],
        },
        {
            title: "Consultas Marcadas",
            name: "scheduledAppointments",
            type: "number",
        },
        {
            title: "Consultas Realizadas",
            name: "consultationsMade",
            type: "number",
        },
        {
            title: "Loja",
            name: "store",
            type: "reference",
            to: [{ type: "store" }],
        }
    ],
}