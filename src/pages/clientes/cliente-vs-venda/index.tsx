// ** React Imports
import {useState} from "react"

// ** MUI Imports
import Card from "@mui/material/Card"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import CardContent from "@mui/material/CardContent"
import LoadingButton from "@mui/lab/LoadingButton"

// ** MUI Icons Imports
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle"
import EmailIcon from "@mui/icons-material/Email"
import LocalPhoneIcon from "@mui/icons-material/LocalPhone"
import StoreIcon from "@mui/icons-material/Store"
import SaveIcon from "@mui/icons-material/Save"

// ** Hooks Imports
import {useForm} from "react-hook-form"
import {useQueryClient} from "@tanstack/react-query"
import * as saleQ from "src/queries/sales"
import {getSaleBySaleNumber} from "src/queries/sales/hooks"
import {getClientByClientNumber} from "src/queries/clients/hooks/useClient"

// ** Third Party Imports
import * as yup from "yup"
import {yupResolver} from "@hookform/resolvers/yup"
import toast from "react-hot-toast"

// ** Third Party Components
import TextInputControlled from "components/inputs/TextInputControlled"
import Client from "interfaces/Client"
import Sale from "interfaces/Sale"
import {SaleCardList} from "src/views/pages/vendas/nova-venda/NewSaleMockup"
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from "@mui/material"
import moment from "moment"
import TagIcon from "@mui/icons-material/Tag"
import TodayIcon from "@mui/icons-material/Today"
import Face3Icon from "@mui/icons-material/Face3"
import FaceIcon from "@mui/icons-material/Face"

const ClientVersusSale = () => {
  // States
  const [client, setClient] = useState<Client | null>(null)
  const [sale, setSale] = useState<Sale | null>(null)
  const [isLoadingSale, setIsLoadingSale] = useState<boolean>(false)
  const [isLoadingClient, setIsLoadingClient] = useState<boolean>(false)

  // React Query
  const queryClient = useQueryClient()
  const updateSale = saleQ.useUpdateClientSaleQuery(queryClient)
  const {isLoading} = updateSale

  // Hook Form
  const {
    control: saleControl,
    handleSubmit: saleHandleSubmit,
    formState: {errors: saleErrors},
    reset: saleReset
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        saleNumber: yup.string().required("Campo obrigatório")
      })
    ),
    defaultValues: {
      saleNumber: ""
    }
  })

  const {
    control: clientControl,
    handleSubmit: clientHandleSubmit,
    formState: {errors: clientErrors},
    reset: clientReset
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        clientNumber: yup.string().required("Campo obrigatório")
      })
    ),
    defaultValues: {
      clientNumber: ""
    }
  })

  const searchSale = async (data: any) => {
    setIsLoadingSale(true)
    const toastId = toast.loading("Buscando venda...", {
      position: "top-center"
    })
    try {
      const sale = await getSaleBySaleNumber(Number(data.saleNumber))
      if (sale?.length === 0)
        return toast.error(
          "Venda não encontrada! Verifique se o código inserido está correto",
          {
            id: toastId,
            position: "top-center"
          }
        )
      setSale(sale[0] as Sale)
      toast.success("Venda encontrada!", {
        id: toastId,
        position: "top-center"
      })
    } catch (error) {
      toast.error(
        "Venda não encontrada! Verifique se o código inserido está correto",
        {
          id: toastId,
          position: "top-center"
        }
      )
    } finally {
      setIsLoadingSale(false)
    }
  }

  const searchClient = async (data: any) => {
    setIsLoadingClient(true)
    const toastId = toast.loading("Buscando cliente...", {
      position: "top-center"
    })
    try {
      const client = await getClientByClientNumber(Number(data.clientNumber))
      if (client?.length === 0)
        return toast.error(
          "Cliente não encontrado! Verifique se o código inserido está correto",
          {
            id: toastId,
            position: "top-center"
          }
        )
      setClient(client[0] as Client)
      toast.success("Cliente encontrado!", {
        id: toastId,
        position: "top-center"
      })
    } catch (error) {
      toast.error(
        "Cliente não encontrado! Verifique se o código inserido está correto",
        {
          id: toastId,
          position: "top-center"
        }
      )
    } finally {
      setIsLoadingClient(false)
    }
  }

  const updateSaleClient = async () => {
    const toastId = toast.loading("Atualizando venda...", {
      position: "top-center"
    })
    try {
      await updateSale.mutateAsync({
        saleID: sale?._id as string,
        clientID: client?._id as string
      })
      toast.success("Venda atualizada!", {
        id: toastId,
        position: "top-center"
      })
      clientReset()
      saleReset()
      setClient(null)
      setSale(null)
    } catch (e) {
      toast.error("Erro ao atualizar venda!", {
        id: toastId,
        position: "top-center"
      })
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography
          variant="h5"
          sx={{display: "flex", alignItems: "center"}}
          marginBottom={3}
          gap={2}
          px={5}
        >
          <SupervisedUserCircleIcon
            sx={{color: "primary.main", fontSize: 30}}
          />{" "}
          Cliente x Venda
        </Typography>
        <Card>
          <CardContent>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  Buscar Venda
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{display: "flex", gap: 3, justifyContent: "center"}}
              >
                <form onSubmit={saleHandleSubmit(searchSale)}>
                  <Typography sx={{display: "flex", gap: 3}}>
                    <TextInputControlled
                      label={"Código da Venda"}
                      name={"saleNumber"}
                      control={saleControl}
                      fullWidth={false}
                      errors={saleErrors}
                    />
                    <LoadingButton
                      loading={isLoadingSale}
                      type={"submit"}
                      variant={"outlined"}
                    >
                      Pesquisar
                    </LoadingButton>
                  </Typography>
                </form>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{display: "flex", gap: 3, justifyContent: "center"}}
              >
                {sale && <SaleCardList newSaleMockup={sale} />}
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  gap={2}
                >
                  Buscar Cliente
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{display: "flex", gap: 3, justifyContent: "center"}}
              >
                <form onSubmit={clientHandleSubmit(searchClient)}>
                  <Typography sx={{display: "flex", gap: 3}}>
                    <TextInputControlled
                      label={"Código do Cliente"}
                      name={"clientNumber"}
                      control={clientControl}
                      fullWidth={false}
                      errors={clientErrors}
                    />
                    <LoadingButton
                      loading={isLoadingClient}
                      type={"submit"}
                      variant={"outlined"}
                    >
                      Pesquisar
                    </LoadingButton>
                  </Typography>
                </form>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{display: "flex", gap: 3, justifyContent: "center"}}
              >
                {client && (
                  <List
                    dense
                    subheader={
                      <ListSubheader>Informações do Cliente</ListSubheader>
                    }
                  >
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <TagIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Código: ${client?.clientNumber || 2222}`}
                        />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          {
                            // @ts-ignore
                            client?.gender === "female" ? (
                              <Face3Icon />
                            ) : (
                              <FaceIcon />
                            )
                          }
                        </ListItemIcon>
                        <ListItemText primary={`Nome: ${client.name}`} />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <TodayIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Criado em: ${
                            moment(client._createdAt).format("DD/MM/YYYY") ||
                            "01/01/2021"
                          }`}
                        />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <StoreIcon />
                        </ListItemIcon>
                        <ListItemText primary={`Loja: ${client.store.name}`} />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <LocalPhoneIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Telefone: ${client.phone || "N/A"}`}
                        />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <EmailIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Email: ${client.email || "N/A"}`}
                        />
                      </ListItemButton>
                    </ListItem>
                  </List>
                )}
              </Grid>
              <Grid
                item
                xs={12}
                sx={{display: "flex", gap: 3, justifyContent: "center"}}
              >
                <LoadingButton
                  onClick={updateSaleClient}
                  loading={isLoading}
                  disabled={!client || !sale}
                  variant={"contained"}
                >
                  <SaveIcon sx={{mr: 1}} />
                  Salvar
                </LoadingButton>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ClientVersusSale
