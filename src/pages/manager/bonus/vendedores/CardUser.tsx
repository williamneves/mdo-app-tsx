// ** React Imports
import { useState, useEffect } from 'react';

// ** MUI Imports
import {
	Avatar,
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Collapse,
	Divider,
	Grid,
	IconButton,
	Typography,
} from '@mui/material';

// ** MUI Icons Imports
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import User from '@src/interfaces/User';
import Goal from '@src/interfaces/Goal';
import Store from '@src/interfaces/Store';
import Sale from '@src/interfaces/Sale';

// ** Import Components
import BonusForm from './BonusForm';

import { getImageUrl } from '@src/configs/sanityConfig';

import { formattedCurrencyWithSymbol} from "src/@utils/formatCurrency";

interface ICardUserProps {
	employee: User;
	goal: Goal;
	store: Partial<Store>;
	sales?: Sale[];
}

const bannerProfile = (employee: Partial<User>) => {
	if (!employee?.profile?.gender) return '/images/banners/banner-7.jpg';

	if (employee?.profile?.gender === 'male') return '/images/banners/banner-4.jpg';

	if (employee?.profile?.gender === 'female') return '/images/banners/banner-14.jpg';

	return '/images/banners/banner-7.jpg';
};

interface IBonusBrief {
	bonusName: string;
	bonusDescription: string;
	bonusAmount: number;
	totalSales: number;
	totalBonus: number;
	totalDiscounts: number;
}

const CardUser = (props: ICardUserProps) => {
	// ** Props
	const { employee, goal, store, sales } = props;

	// ** States
	const [expanded, setExpanded] = useState<boolean>(false);
	const [bonusAmount, setBonusAmount] = useState<number>(0);
	const [bonusBrief, setBonusBrief] = useState<IBonusBrief | null>(null);

	return (
		<Card sx={{ position: 'relative' }}>
			<CardMedia sx={{ height: 178 }} image={bannerProfile(employee)} />
			<Avatar
				alt={employee?.name}
				src={employee?.imageAsset ? getImageUrl(employee.imageAsset).url() : employee?.imageURL}
				sx={{
					top: 110,
					left: 20,
					width: 105,
					height: 105,
					position: 'absolute',
					border: (theme) => `5px solid ${theme.palette.common.white}`,
				}}
			/>
			<CardContent>
				<Box
					sx={{
						mt: 5.75,
						mb: 5.25,
						display: 'flex',
						flexWrap: 'wrap',
						alignItems: 'center',
						justifyContent: 'space-between',
					}}>
					<Box sx={{ mr: 2, mb: 1, display: 'flex', flexDirection: 'column' }}>
						<Typography variant='h6'>{employee.name}</Typography>
						<Typography variant='subtitle2'>{employee.profile.jobTitle}</Typography>
					</Box>
					<Box>
						{
							bonusBrief ? (
								<Box>
									{bonusBrief?.totalSales > 0 && bonusBrief?.totalBonus > 0 &&
										<Typography variant="body2" color={'text.secondary'} textAlign={'right'}>{`(Total em vendas ${formattedCurrencyWithSymbol(bonusBrief.totalSales)})`}</Typography>
									}
									{bonusBrief?.totalBonus > 0 &&
										<Typography variant="h6" color={'text.primary'} textAlign={'right'}>{`Bonus Total ${formattedCurrencyWithSymbol(bonusBrief.totalBonus)}`}</Typography>
									}
									{bonusBrief?.totalDiscounts > 0 &&
										<Typography variant="body2" color={'error.light'} textAlign={'right'}>{`Descontos Totais ${formattedCurrencyWithSymbol(bonusBrief.totalDiscounts)}`}</Typography>
									}
									{bonusBrief?.bonusAmount > 0 &&
										<Typography variant="body1" color={'success.dark'} textAlign={'right'} fontWeight={'bold'}>{`Saldo a receber ${formattedCurrencyWithSymbol(bonusBrief.bonusAmount)}`}</Typography>
									}
								</Box>
							) : (
								<Typography variant='subtitle2' color='primary'>
									Sem lançamentos
								</Typography>
							)
						}
					</Box>
				</Box>
			</CardContent>
			<Divider sx={{ my: 0 }} />
			<CardContent
				sx={{
					py: '10px !important',
				}}>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						flexWrap: 'wrap',
					}}>
					<Button variant='text' color='primary' onClick={() => setExpanded(!expanded)}>
						Expandir Lançamentos
					</Button>

					{expanded ? (
						<IconButton onClick={() => setExpanded(!expanded)}>
							<ExpandLessIcon />
						</IconButton>
					) : (
						<IconButton onClick={() => setExpanded(!expanded)}>
							<ExpandMoreIcon />
						</IconButton>
					)}
				</Box>
			</CardContent>
			<Collapse in={expanded} timeout='auto'>
				<CardContent>
					<Box
						sx={{
							gap: 2,
							display: 'flex',
							flexWrap: 'wrap',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}>
						<Grid container spacing={6}>
							<Grid item xs={12}>
								<BonusForm
									employee={employee}
									bonusAmount={bonusAmount}
									setBonusAmount={setBonusAmount}
									bonusStatus={bonusBrief}
									setBonusStatus={setBonusBrief}
									goal={goal}
									store={store}
									sales={sales}
								/>
							</Grid>
						</Grid>
					</Box>
				</CardContent>
				<Divider sx={{ my: 0 }} />
				<CardContent
					sx={{
						py: '10px !important',
					}}>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							flexWrap: 'wrap',
						}}>
						<Button variant='text' color='primary' onClick={() => setExpanded(!expanded)}>
							Recolher Lançamentos
						</Button>

						{expanded ? (
							<IconButton onClick={() => setExpanded(!expanded)}>
								<ExpandLessIcon />
							</IconButton>
						) : (
							<IconButton onClick={() => setExpanded(!expanded)}>
								<ExpandMoreIcon />
							</IconButton>
						)}
					</Box>
				</CardContent>
			</Collapse>
		</Card>
	);
};

export default CardUser;
