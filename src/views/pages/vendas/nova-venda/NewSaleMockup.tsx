import {formattedCurrency} from "src/@utils/formatCurrency"
import FaceIcon from "@mui/icons-material/Face"
import Face3Icon from "@mui/icons-material/Face3"
import PaidIcon from "@mui/icons-material/Paid"
import PointOfSaleIcon from "@mui/icons-material/PointOfSale"
import FindInPageTwoToneIcon from "@mui/icons-material/FindInPageTwoTone"
import LocalHospitalTwoToneIcon from "@mui/icons-material/LocalHospitalTwoTone"
import FormatColorTextTwoToneIcon from "@mui/icons-material/FormatColorTextTwoTone"
import TagIcon from "@mui/icons-material/Tag"
import TodayIcon from "@mui/icons-material/Today"
import {
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from "@mui/material"
import moment from "moment/moment"
import {getImageUrl} from "src/configs/sanityConfig"
import Sale from "src/interfaces/Sale"
import Origin from "@src/interfaces/Origin"

interface SaleCardProps {
  newSaleMockup: Sale | null
}

const outputOrigins = (origins: any[]) => {
  let output = ""

  origins.forEach((origin, index) => {
    console.log(origin)
    output += origin.displayName
    if (index < origins.length - 1) {
      output += ", "
    }
  })

  console.log(output)

  return output
}

export function SaleCardList({newSaleMockup}: SaleCardProps) {
  return (
    <List dense subheader={<ListSubheader>Resumo da Venda</ListSubheader>}>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <TagIcon />
          </ListItemIcon>
          <ListItemText
            primary={`Venda #${newSaleMockup?.saleNumber || 2222}`}
            secondary={
              // @ts-ignore
              `Número PDV #${newSaleMockup?.PDVNumber || 1234}`
            }
          />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <TodayIcon />
          </ListItemIcon>
          <ListItemText
            primary={`Data da venda: ${
              moment(newSaleMockup?.date).format("DD/MM/YYYY") || "01/01/2021"
            }`}
          />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            {
              // @ts-ignore
              newSaleMockup?.client?.gender === "female" ? (
                <Face3Icon />
              ) : (
                <FaceIcon />
              )
            }
          </ListItemIcon>
          <ListItemText
            primary={`Cliente: ${newSaleMockup?.client?.name || "Cliente"}`}
          />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            {
              // @ts-ignore
              newSaleMockup?.user?.imageAsset ||
              newSaleMockup?.user?.imageURL ? (
                <Avatar
                  src={
                    // @ts-ignore
                    newSaleMockup?.user?.imageAsset
                      ? // @ts-ignore
                        getImageUrl(newSaleMockup?.user?.imageAsset).url()
                      : newSaleMockup?.user?.imageURL
                  }
                  alt={newSaleMockup?.user?.name}
                  sx={{width: 24, height: 24}}
                />
              ) : (
                <FaceIcon />
              )
            }
          </ListItemIcon>
          <ListItemText
            primary={`Vendedor: ${newSaleMockup?.user?.name || "Vendedor"}`}
            secondary={`Loja: ${newSaleMockup?.store?.name || "Loja"}`}
          />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <PointOfSaleIcon />
          </ListItemIcon>
          <ListItemText
            primary={`Valor da venda: R$ ${
              formattedCurrency(newSaleMockup?.saleAmount as number) || "0,00"
            }`}
            secondary={`Custo da venda: R$ ${
              formattedCurrency(newSaleMockup?.totalCost as number) || "0,00"
            }`}
          />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <PaidIcon />
          </ListItemIcon>
          <ListItemText
            primary={`Forma de pagamento: ${
              newSaleMockup?.paymentMethod?.title || "Dinheiro"
            }`}
            secondary={
              newSaleMockup?.paymentMethod?.paymentType === "creditCard" ||
              newSaleMockup?.paymentMethod?.paymentType === "installment" ||
              newSaleMockup?.paymentMethod?.paymentType === "other"
                ? `Parcelas: ${newSaleMockup?.splitQuantity || 1}`
                : null
            }
          />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <FindInPageTwoToneIcon />
          </ListItemIcon>
          <ListItemText
            primary={`Origem do Cliente: ${
              outputOrigins(newSaleMockup?.origin as Origin[]) || "Indefinido"
            }`}
          />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <LocalHospitalTwoToneIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              newSaleMockup?.schedule
                ? `Cliente Fez Consulta`
                : `Cliente Não Fez Consulta`
            }
            secondary={
              newSaleMockup?.scheduleDiscount
                ? `Teve desconto na consulta`
                : null
            }
          />
        </ListItemButton>
      </ListItem>
      {newSaleMockup && newSaleMockup.observations && (
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <LocalHospitalTwoToneIcon />
            </ListItemIcon>
            <ListItemText primary={newSaleMockup.observations} />
          </ListItemButton>
        </ListItem>
      )}
    </List>
  )
}
