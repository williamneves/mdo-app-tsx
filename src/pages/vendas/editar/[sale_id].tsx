// ** Next Router
import { useRouter } from "next/router";

// ** MUI Imports
import { Grid, Typography } from "@mui/material";

// ** MUI Imports Icons
import AddShoppingCartTwoToneIcon from "@mui/icons-material/AddShoppingCartTwoTone";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";

// ** Component Imports
import NovaVendaWizard from "@views/pages/vendas/nova-venda/NovaVendaWizard";
import FallBackSpinner from "@core/components/spinner";


const EditarVenda = () => {
  // ** Next Router
  const router = useRouter();
  const { sale_id } = router.query;
  // If router is not ready, show fallback spinner
  if (!router.isReady) {
    return <FallBackSpinner />;
  }

  return (
    <Grid container spacing={6}>

      <Grid item xs={12}>
        <Typography variant="h6" display={"flex"} alignItems={"center"} gap={2} px={5}>
          <PublishedWithChangesIcon sx={{ color: "primary.main" }} /> Editar Venda
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <NovaVendaWizard />
      </Grid>
    </Grid>
  );
};

EditarVenda.acl = {
  action: "read",
  subject: "acl-page"
};

export default EditarVenda;
