// ** React Imports
import IBonus from "interfaces/Bonus";
import { useState, useEffect, Fragment } from "react";

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
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";

// ** MUI Icons Imports
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ArticleIcon from "@mui/icons-material/Article";
import TableRowsOutlinedIcon from "@mui/icons-material/TableRowsOutlined";

import User from "interfaces/User";
import Goal from "interfaces/Goal";
import Store from "interfaces/Store";
import Sale from "interfaces/Sale";

// ** Import Components
import BonusForm from "src/views/pages/manager/bonus/vendedores/BonusForm";

import { getImageUrl } from "src/configs/sanityConfig";

import { formattedCurrencyWithSymbol } from "src/@utils/formatCurrency";

interface ICardUserProps {
  employee: User;
  goal: Goal;
  store: Partial<Store>;
  sales?: Sale[];
  bonus: IBonus | null;
  mode: "edit" | "view";
}

const bannerProfile = (employee: Partial<User>) => {
  if (!employee?.profile?.gender) return "/images/banners/banner-7.jpg";

  if (employee?.profile?.gender === "male") return "/images/banners/banner-4.jpg";

  if (employee?.profile?.gender === "female") return "/images/banners/banner-14.jpg";

  return "/images/banners/banner-7.jpg";
};

interface IBonusBrief {
  bonusName: string;
  bonusDescription: string;
  bonusAmount: number;
  totalSales: number;
  totalBonus: number;
  totalDiscounts: number;
  bonusStatus: string;
}

const CardUser = (props: ICardUserProps) => {
  // ** Props
  const { employee, goal, store, sales, bonus, mode } = props;

  // ** States
  const [expanded, setExpanded] = useState<boolean>(false);
  const [bonusAmount, setBonusAmount] = useState<number>(0);
  const [bonusBrief, setBonusBrief] = useState<IBonusBrief | null>(null);
  const [showResume, setShowResume] = useState<boolean>(mode === "view");
  const [expandTableRowIds, setExpandTableRowIds] = useState<number[]>([]);

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
    <Card sx={{ position: "relative" }}>
      <CardMedia sx={{ height: 178 }} image={bannerProfile(employee)} />
      <Avatar
        alt={employee?.name}
        src={employee?.imageAsset ? getImageUrl(employee.imageAsset).url() : employee?.imageURL}
        sx={{
          top: 110,
          left: 20,
          width: 105,
          height: 105,
          position: "absolute",
          border: (theme) => `5px solid ${theme.palette.common.white}`
        }}
      />
      <CardContent>
        <Box
          sx={{
            mt: 5.75,
            mb: 5.25,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
          <Box sx={{ mr: 2, mb: 1, display: "flex", flexDirection: "column" }}>
            <Typography variant="h6">{employee.name}</Typography>
            <Typography variant="subtitle2">{employee?.profile?.jobTitle}</Typography>
            <Chip
              label={
              <Typography
                variant="subtitle2"
                sx={{ color: "white" }}
              >
                {
                  bonusBrief?.bonusStatus
                }
              </Typography>
              }
              color={bonusBrief?.bonusStatus === "Pago" ? "success" : "primary"}
              sx={{ mt: 3 }}
            />
          </Box>
          <Box>
            {
              bonusBrief ? (
                <Box>
                  {bonusBrief?.totalSales > 0 && bonusBrief?.totalBonus > 0 &&
                    <Typography variant="body2" color={"text.secondary"}
                                textAlign={"right"}>{`(Total em vendas ${formattedCurrencyWithSymbol(bonusBrief.totalSales)})`}</Typography>
                  }
                  {bonusBrief?.totalBonus > 0 &&
                    <Typography variant="h6" color={"text.primary"}
                                textAlign={"right"}>{`Bonus Total ${formattedCurrencyWithSymbol(bonusBrief.totalBonus)}`}</Typography>
                  }
                  {bonusBrief?.totalDiscounts > 0 &&
                    <Typography variant="body2" color={"error.light"}
                                textAlign={"right"}>{`Descontos Totais ${formattedCurrencyWithSymbol(bonusBrief.totalDiscounts)}`}</Typography>
                  }
                  {bonusBrief?.bonusAmount > 0 &&
                    <Typography variant="body1" color={"success.dark"} textAlign={"right"}
                                fontWeight={"bold"}>{`Saldo a receber ${formattedCurrencyWithSymbol(bonusBrief.bonusAmount)}`}</Typography>
                  }
                </Box>
              ) : (
                <Typography variant="subtitle2" color="primary">
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
          py: "10px !important"
        }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap"
          }}>
          <Button variant="text" color="primary" onClick={() => setExpanded(!expanded)}>
            {
              expanded ? "Recolher detalhes" : "Expandir detalhes"
            }
          </Button>

          {expanded && mode === "edit" &&
            <Button
              variant="text"
              color="secondary"
              onClick={() => setShowResume(!showResume)}
              sx={{ marginRight: "auto" }}
              endIcon={showResume ? <ArticleIcon /> : <TableRowsOutlinedIcon />}
            >
              {
                showResume ? "Resumo" : "Formulário"
              }
            </Button>
          }

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
      <Collapse in={expanded} timeout="auto">
        <CardContent>
          <Box
            sx={{
              gap: 2,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
            <Grid container spacing={6}>
              <Grid item container spacing={4} xs={12}>
                {
                  showResume &&
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
                                <Fragment key={index}>
                                  <TableRow>
                                    <TableCell
                                      sx={{ borderBottom: "unset" }}
                                      padding="checkbox">
                                      <IconButton
                                        onClick={() => setExpandTableRowIds(
                                          expandTableRowIds.includes(index) ?
                                            expandTableRowIds.filter(id => id !== index) :
                                            [...expandTableRowIds, index]
                                        )}
                                      >
                                        {
                                          expandTableRowIds.includes(index) ?
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
                                          bonusTypesLabel[entry.type!]
                                        }
                                      </Typography>
                                    </TableCell>
                                    <TableCell
                                      sx={{ borderBottom: "unset" }}
                                      align="right">
                                      <Typography
                                        variant="subtitle1"
                                        fontWeight={500}
                                        color={entry.operation === "add" ? "primary.main" : "error.main"}
                                      >
                                        {formattedCurrencyWithSymbol(entry.value!)}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell
                                      style={{ paddingBottom: 0, paddingTop: 0 }}
                                      width={"100%"}
                                      colSpan={6}
                                    >
                                      <Collapse in={expandTableRowIds.includes(index)} timeout="auto">
                                        <Typography
                                          variant={"body1"}
                                          marginLeft={10}
                                          marginBottom={5}
                                          style={{
                                            whiteSpace: "pre-wrap"
                                          }}
                                        >
                                          {entry.description}
                                        </Typography>
                                      </Collapse>
                                    </TableCell>
                                  </TableRow>
                                </Fragment>))
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
                  </Fragment>}
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
                    editBonus={bonus}
                    display={showResume ? "none" : "flex"}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider sx={{ my: 0 }} />
        <CardContent
          sx={{
            py: "10px !important"
          }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap"
            }}>
            <Button variant="text" color="primary" onClick={() => setExpanded(!expanded)}>
              Recolher Detalhes
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
