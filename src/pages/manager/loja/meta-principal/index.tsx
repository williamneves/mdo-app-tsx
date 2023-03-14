// ** Main Imports
import {Fragment} from "react"

// ** MUI Imports
import Grid from "@mui/material/Grid"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"

// ** Custom Components Imports
import PageHeader from "src/@core/components/page-header"

// ** Third Party Imports
import moment from "moment"
import MonthlyYearGoalsCardsGrid from "@views/pages/manager/loja/meta-principal/MonthlyYearGoalsCardsGrid"

// ** Import Hooks
import {useAuth} from "src/hooks/useAuth"

// ** Rendered Element

const MetaPrincipalIndex = (): JSX.Element => {
  const {selectedStore} = useAuth()

  const YEAR = parseInt(moment().format("YYYY"))

  return (
    <Grid container spacing={6} className="match-height">
      <PageHeader
        title={
          <Typography variant="h4">
            Metas {selectedStore?.name} - Ano {moment().format("YYYY")}
          </Typography>
        }
        subtitle={
          <Typography variant="subtitle1">
            Abaixo estão os cards com as metas principais do ano{" "}
            {moment().format("YYYY")}.
          </Typography>
        }
      />

      {/*  Monthly Cards */}
      <Grid item xs={12}>
        <MonthlyYearGoalsCardsGrid year={YEAR} />
      </Grid>
    </Grid>
  )
}

export default MetaPrincipalIndex
