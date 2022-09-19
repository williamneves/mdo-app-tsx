export default {
	title: 'Store',
	name: 'store',
	type: 'document',
	fields: [
		{
			title: 'Inativado',
			name: 'inactive',
			type: 'boolean',
		},
		{
			// this is a hidden field that is used to store the user's id
			title: 'Store Name',
			name: 'name',
			type: 'string',
			validation: (Rule) => Rule.required(),
		},
		{
			title: 'Store Tax ID',
			name: 'taxID',
			type: 'string',
			// Validation, is required and must be unique
			validation: (Rule) => [
				Rule.required().error('Tax ID is required'),
			],
		},
		{
			title: 'Store Managers',
			name: 'managers',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{type: 'user'}],
				}
			],
		},
		{
			title: 'Store Employees',
			name: 'employees',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{type: 'user'}],
				},
			],
		},
		{
			title: 'Store Image',
			name: 'imageURL',
			type: 'image',
		},
		{
			title: 'Address',
			name: 'address',
			type: 'object',
			fields: [
				{
					title: 'Street',
					name: 'street',
					type: 'string',
				},
				{
					title: 'Number',
					name: 'number',
					type: 'string',
				},
				{
					title: 'Complement',
					name: 'complement',
					type: 'text',
				},
				{
					title: 'City',
					name: 'city',
					type: 'string',
				},
				{
					title: 'State',
					name: 'state',
					type: 'string',
				},
				{
					title: 'Zip Code',
					name: 'zipCode',
					type: 'string',
				},
			],
		},
	],
};
