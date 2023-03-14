// ** React Imports
import ArticleIcon from "@mui/icons-material/Article"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"

// ** MUI Icons Imports
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import TableRowsOutlinedIcon from "@mui/icons-material/TableRowsOutlined"

// ** MUI Imports
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Collapse,
  Divider,
  Grid,
  IconButton,
  Typography
} from "@mui/material"
import { BonusResume } from "@views/pages/manager/bonus/lancar/BonusResume"
import IBonus from "interfaces/Bonus"
import Goal from "interfaces/Goal"
import Sale from "interfaces/Sale"
import Store from "interfaces/Store"

import User from "interfaces/User"
import { useState } from "react"

import { formattedCurrencyWithSymbol } from "src/@utils/formatCurrency"

import { getImageUrl } from "src/configs/sanityConfig"

// ** Import Components
import BonusForm from "@views/pages/manager/bonus/lancar/BonusForm"

interface ICardUserProps {
  employee: User
  goal: Goal
  store: Partial<Store>
  sales?: Sale[]
  bonus: IBonus | null
  mode: "edit" | "view"
}

const bannerProfile = (employee: Partial<User>) => {
  if (!employee?.profile?.gender) return "/images/banners/banner-7.jpg"

  if (employee?.profile?.gender === "male")
    return "/images/banners/banner-4.jpg"

  if (employee?.profile?.gender === "female")
    return "/images/banners/banner-14.jpg"

  return "/images/banners/banner-7.jpg"
}

export interface IBonusBrief {
  bonusName: string
  bonusDescription: string
  bonusAmount: number
  totalSales: number
  totalBonus: number
  totalDiscounts: number
  bonusStatus: string
}

const CardUser = (props: ICardUserProps) => {
  // ** Props
  const { employee, goal, store, sales, bonus, mode } = props

  // ** States
  const [expanded, setExpanded] = useState<boolean>(false)
  const [bonusAmount, setBonusAmount] = useState<number>(0)
  const [bonusBrief, setBonusBrief] = useState<IBonusBrief | null>(null)
  const [showResume, setShowResume] = useState<boolean>(mode === "view")
  const [expandTableRowIds, setExpandTableRowIds] = useState<number[]>([])

  return (
    <Card sx={{ position: "relative" }}>
      <CardMedia sx={{ height: 178 }} image={bannerProfile(employee)} />
      <Avatar
        alt={employee?.name}
        src={
          employee?.imageAsset
            ? getImageUrl(employee.imageAsset).url()
            : employee?.imageURL
        }
        sx={{
          top: 110,
          left: 20,
          width: 105,
          height: 105,
          position: "absolute",
          border: theme => `5px solid ${theme.palette.common.white}`
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
          }}
        >
          <Box sx={{ mr: 2, mb: 1, display: "flex", flexDirection: "column" }}>
            <Typography variant='h6'>{employee.name}</Typography>
            <Typography variant='subtitle2'>
              {employee?.profile?.jobTitle}
            </Typography>
            <Chip
              label={
                <Typography variant='subtitle2' sx={{ color: "white" }}>
                  {bonusBrief?.bonusStatus}
                </Typography>
              }
              color={bonusBrief?.bonusStatus === "Pago" ? "success" : "primary"}
              sx={{ mt: 3 }}
            />
          </Box>
          <Box>
            {bonusBrief ? (
              <Box>
                {bonusBrief?.totalSales > 0 && bonusBrief?.totalBonus > 0 && (
                  <Typography
                    variant='body2'
                    color={"text.secondary"}
                    textAlign={"right"}
                  >{`(Total em vendas ${formattedCurrencyWithSymbol(
                    bonusBrief.totalSales
                  )})`}</Typography>
                )}
                {bonusBrief?.totalBonus > 0 && (
                  <Typography
                    variant='h6'
                    color={"text.primary"}
                    textAlign={"right"}
                  >{`Bonus Total ${formattedCurrencyWithSymbol(
                    bonusBrief.totalBonus
                  )}`}</Typography>
                )}
                {bonusBrief?.totalDiscounts > 0 && (
                  <Typography
                    variant='body2'
                    color={"error.light"}
                    textAlign={"right"}
                  >{`Descontos Totais ${formattedCurrencyWithSymbol(
                    bonusBrief.totalDiscounts
                  )}`}</Typography>
                )}
                {bonusBrief?.bonusAmount > 0 && (
                  <Typography
                    variant='body1'
                    color={"success.dark"}
                    textAlign={"right"}
                    fontWeight={"bold"}
                  >{`Saldo a receber ${formattedCurrencyWithSymbol(
                    bonusBrief.bonusAmount
                  )}`}</Typography>
                )}
              </Box>
            ) : (
              <Typography variant='subtitle2' color='primary'>
                Sem lançamentos
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
      <Divider sx={{ my: 0 }} />
      <CardContent
        sx={{
          py: "10px !important"
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap"
          }}
        >
          <Button
            variant='text'
            color='primary'
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Recolher detalhes" : "Expandir detalhes"}
          </Button>

          {expanded && mode === "edit" && (
            <Button
              variant='text'
              color='secondary'
              onClick={() => setShowResume(!showResume)}
              sx={{ marginRight: "auto" }}
              endIcon={showResume ? <ArticleIcon /> : <TableRowsOutlinedIcon />}
            >
              {showResume ? "Resumo" : "Formulário"}
            </Button>
          )}

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
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Grid container spacing={6}>
              <Grid item container spacing={4} xs={12}>
                {showResume && (
                  <BonusResume
                    bonus={bonus!}
                    bonusBrief={bonusBrief!}
                    setExpandTableRowIds={setExpandTableRowIds}
                    expandTableRowIds={expandTableRowIds}
                  />
                )}
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
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap"
            }}
          >
            <Button
              variant='text'
              color='primary'
              onClick={() => setExpanded(!expanded)}
            >
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
  )
}

export default CardUser
