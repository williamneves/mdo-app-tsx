export default {
	title: 'User',
	name: 'user',
	type: 'document',
	preview: {
		select: {
			title: 'name',
			subtitle: 'email',
		},
	},
	fields: [
		{
			title: 'Inativado',
			name: 'inactive',
			type: 'boolean',
		},
		{
			// this is a hidden field that is used to store the user's id
			title: 'Auth User',
			name: 'authUID',
			type: 'string',
			validation: (Rule) => Rule.required(),
		},
		{
			title: 'Auth Provider',
			name: 'provider',
			type: 'array',
			of: [
				{type: 'string',}
			],
		},
		{
			title: 'Name',
			name: 'name',
			type: 'string',
			validation: (Rule) => [
				Rule.required().error('Name is required'),
				Rule.min(3).error('Name is required and must be at least 3 characters long'),
			],
		},
		{
			title: 'Email',
			name: 'email',
			type: 'string',
			validation: (Rule) => [
				Rule.required().error('Email is required'),
				Rule.email().error('Email is required and must be a valid email address'),
			],
		},
		{
			title: 'Image URL',
			name: 'imageURL',
			type: 'string',
		},
		{
			title: 'Image Asset',
			name: 'imageAsset',
			type: 'image',
		},
		{
			title: 'User Role',
			name: 'role',
			type: 'string',
			options: {
				list: [
					{title: 'Admin', value: 'admin'},
					{title: 'Manager', value: 'manager'},
					{title: 'Coordinator', value: 'coordinator'},
					{title: 'Vendor', value: 'vendor'},
					{title: 'Street Vendor', value: 'streetVendor'},
					{title: 'Client', value: 'client'},
				],
			},
			validation: ( Rule ) => [
				Rule.required().error( 'User Role is required' ),
			]
		},
		// Personal Information
		{
			title: 'Profile',
			name: 'profile',
			type: 'object',
			fields: [
				{
					title: 'Job Title',
					name: 'jobTitle',
					type: 'string',
				},
				{
					title: 'Birthday',
					name: 'birthday',
					type: 'date',
				},
				{
					title: 'Gender',
					name: 'gender',
					type: 'string',
				},
				{
					title: 'Phone Number',
					name: 'phoneNumber',
					type: 'string',
				},
				{
					title: 'Bio',
					name: 'bio',
					type: 'text',
				},
			],
		}
		,
		// Address
		{
			title: 'Address',
			name: 'address',
			type: 'object',
			fields: [
				{
					title: 'Address',
					name: 'address',
					type: 'string',
				},
				{
					title: 'Number',
					name: 'number',
					type: 'string',
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
				{
					title: 'Description',
					name: 'description',
					type: 'text',
				},
			],
		},
		// Bank Account Information
		{
			title: 'Bank Account',
			name: 'bankAccount',
			type: 'object',
			fields: [
				{
					title: 'CPF',
					name: 'cpf',
					type: "string"
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
				},
				{
					title: 'Chave Pix',
					name: 'chavePix',
					type: 'string',
				},
				{
					title: 'Tipo da Chave Pix',
					name: 'tipoChavePix',
					type: 'string',
				},
			],
		},
	],
};
