import { formattedCurrency } from "@core/utils/formatCurrency";
import FaceIcon from "@mui/icons-material/Face";
import Face3Icon from "@mui/icons-material/Face3";
import PaidIcon from "@mui/icons-material/Paid";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import TagIcon from "@mui/icons-material/Tag";
import TodayIcon from "@mui/icons-material/Today";
import { Avatar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import moment from "moment/moment";
import { getImageUrl } from "src/configs/sanityConfig";
import Sale from "src/interfaces/Sale";

interface SaleCardProps {
  newSaleMockup: Sale | null;
}

export function SaleCardList({ newSaleMockup }: SaleCardProps) {
  return <List dense subheader={<ListSubheader>Resumo da Venda</ListSubheader>}>
    <ListItem disablePadding>
      <ListItemButton>
        <ListItemIcon>
          <TagIcon />
        </ListItemIcon>
        <ListItemText
          primary={`Venda #${newSaleMockup?.saleNumber || 2222}`}
          secondary={
            // @ts-ignore
            `Número PDV #${newSaleMockup?.PDVNumber || 1234}`}
        />
      </ListItemButton>
    </ListItem>
    <ListItem disablePadding>
      <ListItemButton>
        <ListItemIcon>
          <TodayIcon />
        </ListItemIcon>
        <ListItemText
          primary={`Data da venda: ${moment(newSaleMockup?.date).format("DD/MM/YYYY") || "01/01/2021"}`}
        />
      </ListItemButton>
    </ListItem>
    <ListItem disablePadding>
      <ListItemButton>
        <ListItemIcon>
          {
            // @ts-ignore
            newSaleMockup?.client?.gender === "female" ?
              <Face3Icon />
              :
              <FaceIcon />
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
            newSaleMockup?.user?.imageAsset || newSaleMockup?.user?.imageURL ?
              <Avatar

                src={
                  // @ts-ignore
                  newSaleMockup?.user?.imageAsset ?
                    // @ts-ignore
                    getImageUrl(newSaleMockup?.user?.imageAsset).url()
                    : newSaleMockup?.user?.imageURL}
                alt={newSaleMockup?.user?.name}
                sx={{ width: 24, height: 24 }}
              />
              :
              <FaceIcon />
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
          primary={`Valor da venda: R$ ${formattedCurrency(newSaleMockup?.saleAmount!) || "0,00"}`}
          secondary={`Custo da venda: R$ ${formattedCurrency(newSaleMockup?.totalCost!) || "0,00"}`}
        />
      </ListItemButton>
    </ListItem>
    <ListItem disablePadding>
      <ListItemButton>
        <ListItemIcon>
          <PaidIcon />
        </ListItemIcon>
        <ListItemText
          primary={`Forma de pagamento: ${newSaleMockup?.paymentMethod?.title || "Dinheiro"}`}
        />
      </ListItemButton>
    </ListItem>
  </List>;
}