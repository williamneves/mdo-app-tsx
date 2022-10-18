import * as salesQ from "src/queries/sales";

// ** React Imports
import { useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Grid";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Fab from "@mui/material/Fab";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MUIDatepicker from "@mui/lab/DatePicker";
import Divider from "@mui/material/Divider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import TextField from "@mui/material/TextField";
import { DataGrid } from "@mui/x-data-grid";

// ** MUI Icons
import ThumbUpAltTwoToneIcon from "@mui/icons-material/ThumbUpAltTwoTone";
import ThumbDownAltTwoToneIcon from "@mui/icons-material/ThumbDownAltTwoTone";
import UpdateIcon from "@mui/icons-material/Update";

// ** Third Party Imports
import moment from "moment";
import toast from "react-hot-toast";
import QuickDialog from "components/QuickDialog";
import { formattedCurrencyWithSymbol } from "@core/utils/formatCurrency";

// ** Hooks Imports
import { useQueryClient } from "@tanstack/react-query";

// ** Types
import Sale from "src/interfaces/Sale";

const ApproveSales = () => {

  // ** States
  const [rangeDateStart, setRangeDateStart] = useState<Date>(new Date());
  const [rangeDateEnd, setRangeDateEnd] = useState<Date>(new Date());
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [dialogData, setDialogData] = useState({});

  // ** React Query Hooks
  const { data: pendingSales, isLoading: isLoadingSales } = salesQ.usePendingSalesQuery();
  const queryClient = useQueryClient();
  const changeSaleStatus = salesQ.useChangeSaleAuditStatusQuery(queryClient);

  const handleUpdateDates = () => {
    setRangeDateStart(rangeDateStart);
    setRangeDateEnd(rangeDateEnd);
  };

  const changeAuditStatus = async (saleID: string, status: "approved" | "rejected") => {
    const toastId = toast.loading("Aguarde...");
    const statusName = status === "approved" ? "Aprovada" : "Rejeitada";
    try {
      await changeSaleStatus.mutateAsync({ saleID, status });
      toast.success(`Venda ${statusName} com sucesso!`, { id: toastId });
      setOpenDialog(false);
    } catch (e) {
      toast.error(`Erro ao ${statusName} venda!`, { id: toastId });
    }
  };

  const approveAllSales = async () => {
    const toastId = toast.loading("Aguarde...");
    try {
      await Promise.all((pendingSales as Sale[]).map(async (sale: Sale) => {
        await changeSaleStatus.mutateAsync({ saleID: sale._id, status: "approved" });
      }));
      toast.success(`Vendas aprovadas com sucesso!`, { id: toastId });
      setOpenDialog(false);
    } catch (e) {
      toast.error(`Erro ao aprovar vendas!`, { id: toastId });
    }
  };

  const handleApproveAllSales = () => {
    setDialogData({
      headerTitle: "Aprovar todas as vendas",
      content: "Realmente deseja aprovar todas as vendas?",
      actions: [{
        mode: "button",
        props: {
          label: "confirmar",
          color: "primary",
          variant: "contained",
          onClick: () => approveAllSales()
        }
      }, {
        mode: "button",
        props: {
          label: "cancelar",
          color: "error",
          variant: "outlined",
          onClick: () => setOpenDialog(false)
        }
      }]
    });

    setOpenDialog(true);
  };

  const handleApproveRejectSale = (sale: Sale, action: "Aprovar" | "Recusar") => {

    setDialogData({
      id: sale._id,
      sale: sale,
      headerTitle: `${action} venda`,
      content: `Realmente deseja ${action} a venda do dia ${moment(sale.date).format("DD/MM/YYYY")}
       feita por ${sale.user.name} no valor de ${formattedCurrencyWithSymbol(sale.saleAmount)}?`,
      actions: [{
        mode: "button",
        props: {
          label: "confirmar",
          color: "primary",
          variant: "contained",
          onClick: () => changeAuditStatus(sale._id, action === "Aprovar" ? "approved" : "rejected")
        }
      }, {
        mode: "button",
        props: {
          label: "cancelar",
          color: "error",
          variant: "outlined",
          onClick: () => setOpenDialog(false)
        }
      }]
    });

    setOpenDialog(true);
  };

  interface RowData {
    row: Sale;
  }

  // ** Columns
  const columns = [
    {
      headerName: "N. Venda",
      field: "saleNumber",
      minWidth: 90,
      valueGetter: ({ row }: RowData) => row.saleNumber,
      renderCell: ({ row }: RowData) => (
        <Typography variant={"body2"}>{row.saleNumber}</Typography>
      )
    },
    {
      minWidth: 100,
      headerAlign: "center",
      headerName: "Data",
      type: "date",
      field: "date",
      valueGetter: ({ row }: RowData) => moment(row.date).format("DD/MM/YY"),
      renderCell: ({ row }: RowData) => (
        <Typography variant={"body2"}>
          {moment(row.date).format("DD/MM/YY")}
        </Typography>
      )
    },
    {
      minWidth: 150,
      headerName: "Cliente",
      field: "client",
      valueGetter: ({ row }: RowData) => row.client.name,
      renderCell: ({ row }: RowData) => (
        <Typography variant={"body2"}>{row.client.name}</Typography>
      )
    },
    {
      minWidth: 80,
      headerName: "#PDV",
      field: "numberPDV",
      renderCell: ({ row }: RowData) => (
        <Typography variant={"body2"}>
          {`#${row.PDVNumber || "N/A"}`}
        </Typography>
      )
    },
    {
      minWidth: 120,
      headerName: "Valor",
      field: "saleAmount",
      type: "number",
      valueGetter: ({ row }: RowData) => row.saleAmount,
      renderCell: ({ row }: RowData) => (
        <Typography variant={"body2"}>
          {formattedCurrencyWithSymbol(row.saleAmount)}
        </Typography>
      )
    },
    {
      minWidth: 140,
      headerName: "Vendedor",
      field: "user",
      renderCell: ({ row }: RowData) => (
        <Typography variant={"body2"}>{row.user.name}</Typography>
      ),
      valueGetter: ({ row }: RowData) => row.user.name
    },
    {
      minWidth: 170,
      headerName: "Forma de Pagamento",
      field: "paymentMethod",
      valueGetter: ({ row }: RowData) => row.paymentMethod.title,
      renderCell: ({ row }: RowData) => (
        <Typography variant={"body2"}>{row.paymentMethod.title}</Typography>
      )
    },
    {
      flex: 0.125,
      headerName: "Aprovar | Rejeitar",
      field: "auditStatus",
      align: "center",
      sortable: false,
      headerAlign: "center",
      disableColumnMenu: true,
      minWidth: 180,
      renderCell: ({ row }: RowData) => (
        <Box display="flex" justifyContent="center" gap={3} alignItems="center">
          <Fab
            sx={{
              color: "white",
              backgroundColor: "success.dark",
              "&:hover": { backgroundColor: "success.main" },
              width: "35px",
              height: "35px"
            }}
            onClick={() => handleApproveRejectSale(row, "Aprovar")}
          >
            <ThumbUpAltTwoToneIcon fontSize={"small"} />
          </Fab>
          <Fab
            size={"small"}
            sx={{
              color: "white",
              backgroundColor: "error.dark",
              "&:hover": { backgroundColor: "error.main" },
              width: "33px",
              height: "35px"
            }}
            onClick={() => handleApproveRejectSale(row, "Recusar")}
          >
            <ThumbDownAltTwoToneIcon fontSize={"small"} />
          </Fab>
        </Box>
      )
    }
  ];

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Grid container sx={{ paddingTop: 4, paddingX: 3 }} spacing={6}>
            <Grid item xs={12}>
              <Button
                variant={"outlined"}
                onClick={() => handleApproveAllSales()}
              >
                Aprovar tudo
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <CardHeader
                sx={{ textAlign: { xs: "center", md: "left" } }}
                title="Aprovar Vendas"
              />
            </Grid>
            <Grid
              item
              display={"flex"}
              sx={{
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "flex-end",
                alignItems: "center"
              }}
              gap={3}
              xs={12}
              md={6}
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MUIDatepicker
                  label="Data Inicial"
                  value={rangeDateStart}
                  onChange={(newValue) => {
                    setRangeDateStart(newValue as Date);
                  }}
                  renderInput={(params) => (
                    <TextField size={"small"} {...params} />
                  )}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MUIDatepicker
                  label="Data Final"
                  value={rangeDateEnd}
                  onChange={(newValue) => {
                    setRangeDateEnd(newValue as Date);
                  }}
                  renderInput={(params) => (
                    <TextField size={"small"} {...params} />
                  )}
                />
              </LocalizationProvider>
              <Button
                variant="outlined"
                color="primary"
                sx={{ minWidth: "130px" }}
                onClick={handleUpdateDates}
                startIcon={<UpdateIcon />}
              >
                Atualizar
              </Button>
            </Grid>
          </Grid>
          <Divider />
          <DataGrid
            sx={{
              ".MuiDataGrid-columnHeaders": {
                borderRadius: "0px"
              }
            }}
            autoHeight
            getRowId={(row) => row._id}
            loading={isLoadingSales}
            // @ts-ignore
            columns={columns}
            rows={pendingSales || []}
            rowsPerPageOptions={[10, 20, 30, 50, 100]}
          />
        </Card>
      </Grid>
      <QuickDialog
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        contentText={"Deseja realmente aprovar essa venda?"}
        fullWidth={true}
        maxWidth={"sm"}
        // @ts-ignore
        data={dialogData}
      />
    </Grid>
  );
};

export default ApproveSales;