export default {
	title: 'Payment Method',
	name: 'paymentMethod',
	type: 'document',
	fields: [
		{
			title: 'Inativado',
			name: 'inactive',
			type: 'boolean',
		},
		{
			title: 'Title',
			name: 'title',
			type: 'string',
		},
		{
			title: 'Description',
			name: 'description',
			type: 'string',
		},
		{
			title: 'Payment Type',
			name: 'paymentType',
			type: 'string',
			options: {
				list: [
					{ title: 'Cartão de Crédito', value: 'creditCard' },
					{ title: 'Cartão de Débito', value: 'debitCard' },
					{ title: 'Dinheiro', value: 'cash' },
					{ title: 'Crediário', value: 'installment' },
					{ title: 'Pix', value: 'pix' },
					{ title: 'TED', value: 'ted' },
					{ title: 'Outros', value: 'other' },
				],
			},
		},
		{
			title: 'Store',
			name: 'store',
			type: 'reference',
			to: [
				{
					type: 'store',
				}
			],
		},
		{
			title: 'stores',
			name: 'stores',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [ { type: 'store' } ],
				}
			]
		},
		{
			title: 'Bank Account',
			name: 'bankAccount',
			type: 'reference',
			to: [
				{
					type: 'bankAccount',
				},
			],
		},
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'store.name',
		},
		}
};
