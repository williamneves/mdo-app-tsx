import { ChangeEvent } from 'react';
import {
  Grid,
  Card,
  CardHeader,
  CardContent, Button,
  Divider, TextField,
  MenuItem
} from '@mui/material';
import ManageSearchTwoToneIcon from '@mui/icons-material/ManageSearchTwoTone';
import { monthsOfTheYear, years } from 'src/pages/manager/bonus/lancar';
import {IMonthsOfTheYear} from 'src/@types';

import Goal from 'interfaces/Goal';

interface SelectPeriodAndGoalProps {
  selectedGoalId?: string;
  setSelectedGoalId: (goal: string) => void;
  selectedMonth: {label: IMonthsOfTheYear, value: number};
  setSelectedMonth: (month: { label: IMonthsOfTheYear, value: number }) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  goals: Goal[];
  selectDisabled: boolean;
  blockSelectGoal: boolean;
  setBlockSelectGoal: (block: boolean) => void;
}

export function SelectPeriodAndGoal(props: SelectPeriodAndGoalProps) {

  // ** Props
  const {
    selectedGoalId,
    setSelectedGoalId,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    goals,
    selectDisabled,
    blockSelectGoal,
    setBlockSelectGoal
  } = props;

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          title='Selecionar Período e Meta'
          subheader='Ao clicar selecionar, uma lista com os vendedores e alguns outros dados serão exibidos.' />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}>
              <Grid container item xs={12} spacing={3}>
                <Grid item xs={9} md={8}>
                  <TextField
                    select
                    value={selectedMonth.value}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedMonth(monthsOfTheYear[parseInt(e.target.value)])}
                    variant='outlined'
                    label='Mês'
                    placeholder='Selecione o mês'
                    disabled={blockSelectGoal}
                    fullWidth>
                    {monthsOfTheYear.map((month) => (
                      <MenuItem key={month.value} value={month.value}>
                        {month.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={3} md={4}>
                  <TextField
                    select
                    value={selectedYear}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedYear(parseInt(e.target.value))}
                    variant='outlined'
                    label='Ano'
                    placeholder='Selecione o ano'
                    disabled={blockSelectGoal}
                    fullWidth>
                    {years().map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}>
              <Grid
                container
                item
                xs={12}
                spacing={3}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}>
                <Grid item xs={12} md={8}>
                  <TextField
                    select
                    value={selectedGoalId}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedGoalId(e.target.value)}
                    variant='outlined'
                    label='Meta'
                    placeholder='Selecione a meta'
                    disabled={blockSelectGoal}
                    fullWidth>
                    {goals?.length ? (
                      goals?.map((goal) => (
                        <MenuItem key={goal._id} value={goal._id}>
                          {goal.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value=''>Nenhuma meta encontrada</MenuItem>
                    )}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    variant='contained'
                    color='primary'
                    fullWidth
                    size='large'
                    onClick={() => setBlockSelectGoal(!blockSelectGoal)}
                    disabled={selectDisabled}
                    endIcon={<ManageSearchTwoToneIcon />}>
                    {
                      !blockSelectGoal ? 'Selecionar' : 'Alterar'
                    }
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
}
