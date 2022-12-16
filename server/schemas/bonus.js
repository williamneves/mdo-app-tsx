export default {
  name: 'bonus',
  title: 'Bônus',
  type: 'document',
  preview: {
    select: {
      title: 'name',
      subtitle: 'user.name',
    }
  },
  fields: [
    {
      title: 'Inativo',
      name: 'inactive',
      type: 'boolean',
    },
    {
      title: 'Excluído pelo usuário',
      name: 'deleted',
      type: 'boolean',
    },
    {
      title: 'status',
      name: 'status',
      type: 'string',
      options: {
        list: [
          { title: 'Rascunho', value: 'draft' },
          { title: 'Publicado', value: 'posted' },
          { title: 'Pago', value: 'paid' },
        ],
      }
    },
    {
      title: 'Nome da Comissão',
      name: 'name',
      type: 'string',
    },
    {
      title: 'Descrição da Comissão',
      name: 'description',
      type: 'text',
    },
    {
      title: 'Período da Comissão',
      name: 'bonusRange',
      type: 'object',
      fields: [
        {
          title: 'Data de Início',
          name: 'dateStart',
          type: 'date',
          options: {
            dateFormat: 'DD/MM/YYYY',
          },
        },
        {
          title: 'Data de Término',
          name: 'dateEnd',
          type: 'date',
          options: {
            dateFormat: 'DD/MM/YYYY',
          },
        },
      ],
    },
    {
      title: 'Tipo de Comissão',
      name: 'paymentType',
      type: 'string',
      options: {
        list: [
          { title: 'Dinheiro', value: 'cash' },
          { title: 'Pontos', value: 'points' },
          { title: 'Others', value: 'others' },
        ]
      }
    },
    {
      title: 'Lançamentos',
      name: 'bonusEntries',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              title: 'Tipo de Lançamento',
              name: 'type',
              type: 'string',
              options: {
                list: [
                  { title: 'Vendas', value: 'sales' },
                  { title: 'Clientes Abordados', value: 'clientsTaken' },
                  { title: 'Consultas Agendadas', value: 'appointmentsCreated' },
                  { title: 'Comissão de Participação', value: 'shareBonus' },
                  { title: 'Metas Gerenciais', value: 'managerBonus' },
                  { title: 'Outros', value: 'others' },
                  { title: 'Plano de Saúde', value: 'healthCare' },
                  { title: 'Desconto de ajuste', value: 'generalDiscount' },
                ],
              },
            },
            {
              title: 'Descrição do Lançamento',
              name: 'description',
              type: 'text',
            },
            {
              title: 'Tipo de Operação',
              name: 'operation',
              type: 'string',
              options: {
                list: [
                  {
                    title: 'Entrada',
                    value: 'add',
                  },
                  {
                    title: 'Saída',
                    value: 'subtract',
                  }
                ]
              }
            },
            {
              title: 'Valor do Lançamento',
              name: 'value',
              type: 'number',
            }
          ],
        }
      ],
    },
    {
      title: 'Valor Final da Comissão',
      name: 'bonusAmount',
      type: 'number',
    },
    {
      title: 'Meta Relacionada',
      name: 'goal',
      type: 'reference',
      to: [{ type: 'goal' }],
    },
    {
      title: 'Usuário',
      name: 'user',
      type: 'reference',
      to: [{ type: 'user' }],
    },
    {
      title: 'Loja',
      name: 'store',
      type: 'reference',
      to: [{ type: 'store' }],
    }
  ],
}