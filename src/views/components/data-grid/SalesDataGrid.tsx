// ** React Imports
import React, { Fragment, useEffect, useState } from "react";

// ** Next Router
import { useRouter } from "next/router";

// ** MUI Imports
import {
  Box,
  Grid,
  Card,
  CardHeader,
  IconButton,
  TextField,
  Typography,
  Divider,
  Chip,
  Avatar,
  Button
} from "@mui/material";
import { DataGrid, GridColumns } from "@mui/x-data-grid";

// ** MUI Icons Imports
import GroupsIcon from "@mui/icons-material/Groups";
import Close from "mdi-material-ui/Close";
import Magnify from "mdi-material-ui/Magnify";
import PointOfSaleTwoToneIcon from "@mui/icons-material/PointOfSaleTwoTone";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import HourglassTopTwoToneIcon from "@mui/icons-material/HourglassTopTwoTone";
import ThumbDownAltTwoToneIcon from "@mui/icons-material/ThumbDownAltTwoTone";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import BorderColorTwoToneIcon from "@mui/icons-material/BorderColorTwoTone";

// ** Interface
import Sale from "interfaces/Sale";


// Third Party Imports
import moment from "moment";
import { filterSales, matchSearchFilterByKeys } from "src/@utils/filters";
import { formattedCurrencyWithSymbol } from "src/@utils/formatCurrency";

// ** Components
import SimpleDialog, { DataDialog } from "components/SimpleDialog";
import { SaleCardList } from "src/views/pages/vendas/nova-venda/NewSaleMockup";

// ** Rendered Element
interface SalesDataGridProps {
  sales: Sale[];
  loading: boolean;
}

interface RowsData {
  row: Sale;
}

// ** AuditStatus Colors
interface AuditStatusColors {
  color: "warning" | "success" | "error" | "default" | "primary" | "secondary" | "info" | undefined;
  text: string;
  icon: React.ReactNode;
}

const auditStatusColors = (status: "pending" | "approved" | "rejected") => {
  switch (status) {
    case "pending":
      return {
        color: "warning",
        text: "Pendente",
        icon: <HourglassTopTwoToneIcon fontSize={"small"} color="warning" />
      };
    case "approved":
      return {
        color: "success",
        text: "Aprovado",
        icon: <CheckCircleTwoToneIcon fontSize={"small"} color="success" />
      };
    case "rejected":
      return {
        color: "error",
        text: "Rejeitado",
        icon: <ThumbDownAltTwoToneIcon fontSize={"small"} color="error" />
      };
    default:
      return {
        color: "warning",
        text: "Pendente",
        icon: <HourglassTopTwoToneIcon fontSize={"small"} color="warning" />
      };
  }
};

const SalesDataGrid = (props: SalesDataGridProps): JSX.Element => {

  const router = useRouter();

  // ** Props
  const {
    sales,
    loading
  } = props;

  // ** States
  const [searchText, setSearchText] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const pageSizeOptions = [10, 25, 50, 100];
  const filteredData = sales.length > 0 ? filterSales(sales, searchText) : [];
  const [viewSaleData, setViewSaleData] = useState<DataDialog | null>(null);
  const [openViewSaleDialog, setOpenViewSaleDialog] = useState<boolean>(false);

  // ** Handlers
  const handleSaleOpen = (id: string) => {
    const sale = sales.find((sale) => sale._id === id);
    const dialogData: DataDialog = {
      title: "Detalhes da Venda",
      message: <SaleCardList newSaleMockup={sale!} />,
      confirm: sale?.auditStatus === "approved" ? "Fechar" : "Editar",
      cancel: sale?.auditStatus === "approved" ? null: "Fechar",
      confirmColor: "primary",
      cancelColor: "secondary",
      confirmAction: () => sale?.auditStatus === "approved" ? () => setOpenViewSaleDialog(true): router.push(`/vendas/editar/${id}`),
    }
    setViewSaleData(dialogData);
    setOpenViewSaleDialog(true);
  };

  // ** Columns
  const columns: GridColumns = [
    {
      field: "date",
      headerName: "Data",
      type: "date",
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }: RowsData) => (
        <Typography variant="body2">
          {/* @ts-ignore */}
          {row.date}
        </Typography>
      )
    },
    {
      field: "saleNumber",
      headerName: "N Venda",
      type: "number",
      align: "center",
      headerAlign: "center",
      minWidth: 140,
      renderCell: ({ row }: RowsData) => (
        <Box width={"100%"}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="body2">
              {row.saleNumber}
            </Typography>
          </Box>
          {row.PDVNumber &&
            <Fragment>
              <Divider sx={{ paddingY: 0, marginY: 0, width: "100%" }} />
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="body2">
                  PDV: {row.PDVNumber}
                </Typography>
              </Box>
            </Fragment>
          }
        </Box>
      )
    },
    {
      field: "saleAmount",
      headerName: "Valor N.F.",
      type: "number",
      align: "center",
      headerAlign: "center",
      minWidth: 140,
      renderCell: ({ row }: RowsData) => (
        <Typography variant="body2">
          {formattedCurrencyWithSymbol(row.saleAmount)}
        </Typography>
      )
    },
    {
      field: "client.name",
      headerName: "Cliente",
      type: "string",
      align: "left",
      headerAlign: "left",
      flex: 1,
      renderCell: ({ row }: RowsData) => (
        <Typography variant="body2">
          {row.client.name.toUpperCase()}
        </Typography>
      )
    },
    {
      field: "score",
      headerName: "Score",
      type: "number",
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }: RowsData) => (
        <Typography variant="body2">
          {row.score.toFixed(2)}
        </Typography>
      )
    },
    {
      field: "paymentMethod",
      headerName: "Forma de Pagamento",
      type: "string",
      align: "center",
      headerAlign: "center",
      flex: 1,
      minWidth: 150,
      renderCell: ({ row }: RowsData) => (
        <Typography variant="body2">
          {row.paymentMethod.title}
        </Typography>
      )
    },
    {
      field: "auditStatus",
      headerName: "Status",
      type: "string",
      align: "center",
      headerAlign: "center",
      flex: 1,
      minWidth: 150,
      renderCell: ({ row }: RowsData) => {
        const { color, text, icon } = auditStatusColors(row.auditStatus);
        return (
          <Chip
            label={text}
            // @ts-ignore
            color={color}
            size={"small"}
            variant={"outlined"}
            avatar={<Avatar>
              {icon}
            </Avatar>}
          />
        );
      }
    },
    {
      field: "acoes",
      headerName: "Ações",
      type: "string",
      align: "center",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      disableReorder: true,
      width: 120,
      renderCell: ({ row }: RowsData) => (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
          <IconButton
            size={"small"}
            color={"primary"}
            onClick={() => handleSaleOpen(row._id)}
          >
            <VisibilityTwoToneIcon fontSize={"small"} />
          </IconButton>
          {row.auditStatus === "pending" &&
            <IconButton
              size={"small"}
              color={"secondary"}
              onClick={() => router.push(`/vendas/editar/${row._id}`)}
            >
              <BorderColorTwoToneIcon fontSize={"small"} />
            </IconButton>
          }
        </Box>
      )
    }
  ];

  return (
    <Fragment>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Typography variant={"h6"} sx={{ display: "flex", alignItems: "center" }}>
                  <PointOfSaleTwoToneIcon color={"primary"} sx={{ mr: 2, fontSize: 30 }} />
                  Minhas Vendas
                </Typography>
              }
              action={
                <TextField
                  label="Pesquisar"
                  variant="standard"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  InputProps={{
                    startAdornment: <Magnify fontSize="small" />,
                    endAdornment: (
                      <IconButton size="small" title="Clear" aria-label="Clear" onClick={() => setSearchText("")}>
                        <Close fontSize="small" />
                      </IconButton>
                    )
                  }}
                />
              }
            />
            <DataGrid
              sx={{
                // Remove border Radius
                "& .MuiDataGrid-columnHeaders": {
                  borderRadius: 0
                }
              }}
              getRowId={(row) => row._id}
              autoHeight={true}
              loading={loading}
              rows={sales && sales.length > 0 && filteredData || []}
              columns={columns}
              pageSize={pageSize}
              rowsPerPageOptions={pageSizeOptions}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            />
          </Card>
        </Grid>
      </Grid>
      {/* @ts-ignore */}
      <SimpleDialog
        open={Boolean(viewSaleData) && openViewSaleDialog}
        setOpen={setOpenViewSaleDialog}
        data={viewSaleData!}
      />
    </Fragment>
  );
};

export default SalesDataGrid;