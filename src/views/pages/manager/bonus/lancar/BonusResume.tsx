import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Collapse,
  Divider,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { IBonusBrief } from "@views/pages/manager/bonus/lancar/CardUser";
import IBonus from "interfaces/Bonus";
import { Fragment, SetStateAction } from "react";
import { formattedCurrencyWithSymbol } from "src/@utils/formatCurrency";


function BonusResumeTableRow(props: { onClick: () => void, numbers: number[], searchElement: any, bonusTypesLabel: { [p: string]: string }, entry: any }) {
  return <Fragment>
    <TableRow>
      <TableCell
        sx={{ borderBottom: "unset" }}
        padding="checkbox">
        <IconButton
          onClick={props.onClick}
        >
          {
            props.numbers.includes(props.searchElement) ?
              <ExpandLessIcon /> :
              <ExpandMoreIcon />
          }
        </IconButton>
      </TableCell>
      <TableCell
        sx={{ borderBottom: "unset" }}
        colSpan={4}
      >
        <Typography
          variant="subtitle1"
        >
          {
            props.bonusTypesLabel[props.entry.type!]
          }
        </Typography>
      </TableCell>
      <TableCell
        sx={{ borderBottom: "unset" }}
        align="right">
        <Typography
          variant="subtitle1"
          fontWeight={500}
          color={props.entry.operation === "add" ? "primary.main" : "error.main"}
        >
          {formattedCurrencyWithSymbol(props.entry.value!)}
        </Typography>
      </TableCell>
    </TableRow>
    <TableRow>
      <TableCell
        style={{ paddingBottom: 0, paddingTop: 0 }}
        width={"100%"}
        colSpan={6}
      >
        <Collapse in={props.numbers.includes(props.searchElement)} timeout="auto">
          <Typography
            variant={"body1"}
            marginLeft={10}
            marginBottom={5}
            style={{
              whiteSpace: "pre-wrap"
            }}
          >
            {props.entry.description}
          </Typography>
        </Collapse>
      </TableCell>
    </TableRow>
  </Fragment>;
}


export function BonusResume(props: {
  bonus: IBonus,
  bonusBrief: IBonusBrief,
  setExpandTableRowIds: (value: SetStateAction<number[]>) => void,
  expandTableRowIds: number[]
}) {

  const { bonus, bonusBrief, setExpandTableRowIds, expandTableRowIds } = props;

  const paymentTypesLabel: { [key: string]: string } = {
    cash: "Reais",
    points: "Pontos",
    others: "Outros"
  };

  const bonusTypesLabel: { [key: string]: string } = {
    sales: "Vendas",
    clientsTaken: "Clientes Abordados",
    appointmentsCreated: "Consultas Agendadas",
    shareBonus: "Comissão de Participação",
    managerBonus: "Metas Gerencias",
    others: "Outros",
    healthCare: "Plano de Saúde",
    generalDiscount: "Desconto de Ajuste"
  };

  return (
    <Fragment>
      <Grid item xs={12} sx={{ paddingY: "0!important" }}>
        <Divider sx={{ my: 0 }}>
          <Box>
            <Typography
              variant="subtitle1"
            >
              Resumo dos Lançamentos
            </Typography>
          </Box>
        </Divider>
      </Grid>
      <Grid item xs={12}>
        <Typography
          variant="subtitle1"
          color={"text.secondary"}
        >
          <b>Nome do Bonus</b>: {bonus?.name} | (Pgto em {paymentTypesLabel[bonus?.paymentType!]})
        </Typography>
        <Typography
          variant="body1"
          color={"text.secondary"}
        >
          <b>Descrição do Bonus</b>: {bonus?.description}
        </Typography>

      </Grid>
      <Grid item xs={12}>
        <TableContainer>
          <Table
            sx={{
              ".MuiTableCell-root:first-of-type": {
                width: "70px"
              }
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  padding="checkbox"
                />
                <TableCell>Lançamento</TableCell>
                <TableCell colSpan={3} />
                <TableCell align="right">Valor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                bonus?.bonusEntries?.map((entry, index) => (
                  <BonusResumeTableRow
                    key={index}
                    onClick={() => setExpandTableRowIds(
                      expandTableRowIds.includes(index) ?
                        expandTableRowIds.filter(id => id !== index) :
                        [...expandTableRowIds, index]
                    )}
                    numbers={expandTableRowIds}
                    searchElement={index}
                    bonusTypesLabel={bonusTypesLabel}
                    entry={entry} />
                ))
              }
              <TableRow>
                <TableCell colSpan={3} sx={{
                  borderBottom: "unset"
                }} />
                <TableCell colSpan={2}>Entradas</TableCell>
                <TableCell align="right">
                  <Typography
                    variant="subtitle1"
                    fontWeight={500}
                    color={"primary.main"}
                  >
                    {`${formattedCurrencyWithSymbol(bonusBrief?.totalBonus!)}`}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} sx={{
                  borderBottom: "unset"
                }} />
                <TableCell colSpan={2}>Saídas</TableCell>
                <TableCell
                  align="right">
                  <Typography
                    variant="subtitle1"
                    fontWeight={500}
                    color={"error.main"}
                  >
                    {`(${formattedCurrencyWithSymbol(bonusBrief?.totalDiscounts!)})`}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} sx={{
                  borderBottom: "unset"
                }} />
                <TableCell colSpan={2} align="right">Total</TableCell>
                <TableCell
                  align="right">
                  <Typography
                    variant="subtitle1"
                    fontWeight={500}
                    color={"text.primary"}
                  >
                    {formattedCurrencyWithSymbol(bonusBrief?.bonusAmount!)}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Fragment>);
}