// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline';
import EmailOutline from 'mdi-material-ui/EmailOutline';
import ShieldOutline from 'mdi-material-ui/ShieldOutline';
import Table from 'mdi-material-ui/Table';
import TableLargePlus from 'mdi-material-ui/TableLargePlus';
import LocalMallTwoToneIcon from '@mui/icons-material/LocalMallTwoTone';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import DashboardTwoToneIcon from '@mui/icons-material/DashboardTwoTone';
import ListAltTwoToneIcon from '@mui/icons-material/ListAltTwoTone';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import VerifiedTwoToneIcon from '@mui/icons-material/VerifiedTwoTone';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';
import StarTwoToneIcon from '@mui/icons-material/StarTwoTone';
import PendingTwoToneIcon from '@mui/icons-material/PendingTwoTone';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import PaidTwoToneIcon from '@mui/icons-material/PaidTwoTone';
import TrafficTwoToneIcon from '@mui/icons-material/TrafficTwoTone';
import RedeemTwoToneIcon from '@mui/icons-material/RedeemTwoTone';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import QuizTwoToneIcon from '@mui/icons-material/QuizTwoTone';

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types';

const navigation = (): VerticalNavItemsType => {
	return [
		{
			title: 'Home',
			icon: HomeOutline,
			path: '/home',
		},
		{
			title: 'F.A.Q.',
			icon: QuizTwoToneIcon,
			path: '/faq',
		},
		{
			sectionTitle: 'Clientes',
			action: 'read',
			subject: 'street-page',
		},
		{
			title: 'Clientes',
			icon: LocalMallTwoToneIcon,
			action: 'read',
			subject: 'street-page',
			children: [
				{
					title: 'Novo Cliente',
					path: '/clientes/novo-cliente',
					icon: PersonAddIcon,
					action: 'create',
					subject: 'street-page',
				},
				{
					title: 'Lista de Clientes',
					path: '/clientes/lista-de-clientes',
					icon: RecentActorsIcon,
					action: 'read',
					subject: 'street-page',
				},
			],
		},
		{
			sectionTitle: 'Streets',
			action: 'read',
			subject: 'street-page',
		},
		{
			title: 'Street',
			icon: TrafficTwoToneIcon,
			action: 'read',
			subject: 'street-page',
			children: [
				{
					title: 'Relatório Diário',
					path: '/street/daily-report',
					icon: AddCircleTwoToneIcon,
					action: 'create',
					subject: 'street-page',
				},
				{
					title: 'Novo Cliente',
					path: '/clientes/novo-cliente',
					icon: PersonAddIcon,
					action: 'create',
					subject: 'street-page',
				},
				{
					title: 'Lista de Clientes',
					path: '/clientes/lista-de-clientes',
					icon: RecentActorsIcon,
					action: 'read',
					subject: 'street-page',
				},
			],
		},
		{
			sectionTitle: 'Vendedor',
			action: 'read',
			subject: 'vendor-page',
		},
		{
			title: 'Vendas',
			icon: LocalMallTwoToneIcon,
			action: 'read',
			subject: 'vendor-page',
			children: [
				// {
				//   title: "Dashboard",
				//   path: "/vendas/dashboard",
				//   icon: DashboardTwoToneIcon,
				//   action: "read",
				//   subject: "vendor-page",
				// },
				{
					title: 'Nova Venda',
					path: '/vendas/nova-venda',
					icon: AddCircleTwoToneIcon,
					action: 'create',
					subject: 'vendor-page',
					badgeContent: 'Novo',
					badgeColor: 'primary',
				},
				{
					title: 'Editar Venda',
					path: '/vendas/editar',
					icon: PublishedWithChangesIcon,
					action: 'update',
					subject: 'vendor-page',
					badgeColor: 'primary',
					disabled: true,
				},
				{
					title: 'Minhas Vendas',
					path: '/vendas/minhas-vendas',
					icon: ListAltTwoToneIcon,
					action: 'read',
					subject: 'vendor-page',
				},
			],
		},
		{
			sectionTitle: 'Administração',
			action: 'read',
			subject: 'manager-page',
		},
		{
			title: 'Venda',
			path: '/manager',
			icon: SettingsTwoToneIcon,
			action: 'read',
			subject: 'manager-page',
			children: [
				{
					title: 'Dashboard',
					path: '/manager/dashboard',
					icon: DashboardTwoToneIcon,
					action: 'read',
					subject: 'manager-page',
				},
				{
					title: 'Aprovar Vendas',
					path: '/manager/aprovar-vendas',
					icon: VerifiedTwoToneIcon,
					action: 'update',
					subject: 'manager-page',
				},
			],
		},
		{
			title: 'Gerenciar Bônus',
			path: '/manager/bonus/',
			icon: PaidTwoToneIcon,
      children: [
        {
					title: 'Lançar Bônus',
					path: '/manager/bonus/lancar',
        },
			],
		},
		{
			title: 'Loja',
			path: '/manager/loja/',
			icon: StorefrontTwoToneIcon,
			children: [
				{
					title: 'Meta Principal',
					path: '/manager/loja/meta-principal',
					icon: StarTwoToneIcon,
				},
				{
					title: 'Outras Metas',
					path: '/manager/loja/outras-metas',
					icon: PendingTwoToneIcon,
				},
				{
					title: 'Gerenciar Metas',
					path: '/manager/loja/gerenciar-metas',
					icon: ListAltTwoToneIcon,
				},
			],
		},
		{
			sectionTitle: 'Financeiro',
			action: 'read',
			subject: 'finance-page',
		},
		{
			title: 'Prêmios & Bônus',
			icon: WorkspacePremiumOutlinedIcon,
			path: '/financeiro/premios',
			action: 'read',
			subject: 'finance-page',
			children: [
				{
					title: 'Resgatar',
					path: '/financeiro/premios/resgatar',
					icon: RedeemTwoToneIcon,
					action: 'edit',
					subject: 'finance-page',
				},
			],
		},
		{
			sectionTitle: 'Perfil',
			action: 'read',
			subject: 'general-page',
		},
		{
			title: 'Ajustes da Conta',
			icon: SettingsTwoToneIcon,
			path: '/account-settings',
			action: 'manage',
			subject: 'user-page',
		},
	];
};

export default navigation;
