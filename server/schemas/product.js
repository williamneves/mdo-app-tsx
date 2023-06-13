export default {
	title: 'Product',
	name: 'product',
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
			validation: (Rule) => Rule.required(),
		},
		{
			title: 'Description',
			name: 'description',
			type: 'string',
		},
		{
			title: 'Product SKU',
			name: 'sku',
			type: 'string',
		},
		{
			title: 'Category',
			name: 'category',
			type: 'string',
			options: {
				list: [
					{ title: 'Armação Grau', value: 'armacao-grau' },
					{ title: 'Oculos Solar', value: 'oculos-solar' },
					{ title: 'Lente', value: 'lente' },
					{ title: 'Outros', value: 'outros' },
				],
			},
			validation: (Rule) => Rule.required(),
		},
		{
			title: 'Store',
			name: 'store',
			type: 'reference',
			to: [{ type: 'store' }],
		},
		{
			title: 'stores',
			name: 'stores',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'store' }],
				}
			]
		},
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'category',
		},
	},
};
