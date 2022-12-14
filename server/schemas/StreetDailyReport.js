export default {
    title: "Relatório Diário do Street",
    name: "streetDailyReport",
    type: "document",
    preview: {
        select: {
            title: "reportDate",
            subtitle: "reporter.name",
        }
    },
    fields: [
        {
            title: "Inativo",
            name: "inactive",
            type: "boolean",
        },
        {
            title: "Excluído",
            name: "excluded",
            type: "boolean",
        },
        {
            title: "Data do Relatório",
            name: "reportDate",
            type: "date",
            options: {
                dateFormat: "DD/MM/YY",
            },
        },
        {
            title: "Reportado por",
            name: "reporter",
            type: "reference",
            to: [{type: "user"}],
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
                    {title: "Pendente", value: "pending"},
                    {title: "Aprovado", value: "approved"},
                    {title: "Rejeitado", value: "rejected"},
                ],
                default: "pending",
            },
        },
        {
            title: "Clientes Abordados",
            name: "clientsApproached",
            type: "number",
        },
        {
            title: "Clientes Cadastrados",
            name: "clientsRegistered",
            type: "array",
            of: [{
                type: "reference",
                to: [{type: "client"}],
            }],
        },
        {
            title: "Consultas Agendadas",
            name: "scheduledAppointments",
            type: "number",
        },
        {
            title: "Relatório de Atividades",
            name: "activitiesReport",
            type: "string",
        },
        {
            title: "Store",
            name: "store",
            type: "reference",
            to: [{type: "store"}],
        },
    ]
}