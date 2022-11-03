export default {
  name: 'bonus',
  title: 'Bônus',
  type: 'document',
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
      title: 'Nome da Comissão',
      name: 'name',
      type: 'string',
    },
    {
      title: 'Descrição da Comissão',
      name: 'description',
      type: 'string',
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
      name: 'type',
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
              title: 'Descrição do Lançamento',
              name: 'description',
              type: 'string',
            },
            {
              title: 'Tipo de Lançamento',
              name: 'type',
              type: 'string',
              options: {
                list: [
                  {
                    title: 'Entrada',
                    value: 'bonus',
                  },
                  {
                    title: 'Saída',
                    value: 'discount',
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