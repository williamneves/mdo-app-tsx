// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Component Imports
import NovaVendaWizard from '@views/pages/vendas/nova-venda/NovaVendaWizard'

// ** MUI Imports Icons
import AddShoppingCartTwoToneIcon from '@mui/icons-material/AddShoppingCartTwoTone';

const NovaVenda = () => {
  return (
    <Grid container spacing={6}>

      <Grid item xs={12}>
        <Typography variant='h5' display={"flex"} alignItems={'center'} gap={2} px={5}>
          <AddShoppingCartTwoToneIcon sx={{color:'primary.main'}}/> Cadastrar Nova Venda
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <NovaVendaWizard />
      </Grid>
    </Grid>
  )
}

NovaVenda.acl = {
  action: 'create',
  subject: 'vendor-page'
}

export default NovaVenda
