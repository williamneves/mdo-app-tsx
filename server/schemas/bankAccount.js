export default {
	title: 'Bank Account',
	name: 'bankAccount',
	type: 'document',
	preview: {
		select: {
			title: 'bankName',
			subtitle: 'store.name',
		}
	},
	fields: [
		{
			title: 'Inativado',
			name: 'inactive',
			type: 'boolean',
		},
		{
			title: 'Bank Name',
			name: 'bankName',
			type: 'string',
		},
		{
			title: 'Account Number',
			name: 'accountNumber',
			type: 'string',
		},
		{
			title: 'Routing Number',
			name: 'routingNumber',
			type: 'string',
    },
    {
      title: 'Account Type',
      name: 'accountType',
			type: 'string',
			options: {
				list: [
					{ title: 'Corrente', value: 'checking' },
					{ title: 'Poupança', value: 'savings' },
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
				},
			],
		},
	],
};
