export default {
	title: 'Origin',
	name: 'origin',
	type: 'document',
	preview: {
		select: {
			title: 'displayName',
			subtitle: 'name',
		}
	},
	fields: [
		{
			title: 'Inativado',
			name: 'inactive',
			type: 'boolean',
		},
		{
			title: 'Display Name',
			name: 'displayName',
			type: 'string',
		},
		{
			title: 'Name',
			name: 'name',
			type: 'string',
		}
	]
}