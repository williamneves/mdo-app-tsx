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

// ** Import Api
import * as salesQ from "src/queries/sales";

const EditarVenda = () => {
  // ** Next Router
  const router = useRouter();
  const { sale_id } = router.query;
  // If router is not ready, show fallback spinner
  if (!router.isReady) {
    return <FallBackSpinner />;
  }

  // ** React Query
  const { data: sale, isLoading } = salesQ.useGetSaleByIDQuery(sale_id as string);

  if (isLoading) {
    return <FallBackSpinner />;
  }

  console.log(sale);

  return (
    <Grid container spacing={6}>

      <Grid item xs={12}>
        <Typography variant="h6" display={"flex"} alignItems={"center"} gap={2} px={5}>
          <PublishedWithChangesIcon sx={{ color: "primary.main" }} /> Editar Venda
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <NovaVendaWizard mode={"edit"} editSale={sale} />
      </Grid>
    </Grid>
  );
};

EditarVenda.acl = {
  action: "read",
  subject: "acl-page"
};

export default EditarVenda;
