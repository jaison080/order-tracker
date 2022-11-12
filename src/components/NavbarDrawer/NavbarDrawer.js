import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import GroupsIcon from "@mui/icons-material/Groups";
import { styled, useTheme } from "@mui/material/styles";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CategoryIcon from "@mui/icons-material/Category";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SellIcon from "@mui/icons-material/Sell";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ArticleIcon from "@mui/icons-material/Article";
import { useRouter } from "next/router";
const drawerWidth = 300;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));
const DrawerHeader1 = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  fontSize: "20px",
  padding: theme.spacing(0, 3),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const NavbarDrawer = (props) => {
  let drawerElementColor = [];
  const router = useRouter();
  [
    "/dashboard",
    "/cities",
    "/customers",
    "/dealers",
    "/products",
    "/pending",
    "/generatebill",
    "/delivery",
  ].map((path, index) => {
    if (router.asPath === path) {
      drawerElementColor[index] = "Black";
    } else {
      drawerElementColor[index] = "primary";
    }
  });
  const theme = useTheme();
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={props.drawerOpen}
    >
      <DrawerHeader>
        <DrawerHeader1>
          <div>
            <strong>ORDER TRACKER</strong>
          </div>
        </DrawerHeader1>
        <IconButton
          onClick={() => {
            props.setDrawerOpen(false);
          }}
        >
          {theme.direction === "ltr" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </DrawerHeader>

      <Divider />
      <List>
        <ListItem
          button
          key="All Orders"
          sx={{ color: drawerElementColor[0] }}
          onClick={() => router.push("/dashboard")}
        >
          <ListItemIcon sx={{ color: drawerElementColor[0] }}>
            <ArticleIcon />
          </ListItemIcon>
          <ListItemText primary="All Orders" />
        </ListItem>
        <ListItem
          button
          key="Cities"
          sx={{ color: drawerElementColor[1] }}
          onClick={() => router.push("/cities")}
        >
          <ListItemIcon sx={{ color: drawerElementColor[1] }}>
            <ApartmentIcon />
          </ListItemIcon>
          <ListItemText primary="Cities" />
        </ListItem>

        <ListItem
          button
          key="Customers"
          sx={{ color: drawerElementColor[2] }}
          onClick={() => router.push("/customers")}
        >
          <ListItemIcon sx={{ color: drawerElementColor[2] }}>
            <GroupsIcon />
          </ListItemIcon>
          <ListItemText primary="Customers" />
        </ListItem>

        <ListItem
          button
          key="Dealers"
          sx={{ color: drawerElementColor[3] }}
          onClick={() => router.push("/dealers")}
        >
          <ListItemIcon sx={{ color: drawerElementColor[3] }}>
            <StorefrontIcon />
          </ListItemIcon>
          <ListItemText primary="Dealers" />
        </ListItem>

        <ListItem
          button
          key="Products"
          sx={{ color: drawerElementColor[4] }}
          onClick={() => router.push("/products")}
        >
          <ListItemIcon sx={{ color: drawerElementColor[4] }}>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary="Products" />
        </ListItem>

        <ListItem
          button
          key="Pending Orders"
          sx={{ color: drawerElementColor[5] }}
          onClick={() => router.push("/pending")}
        >
          <ListItemIcon sx={{ color: drawerElementColor[5] }}>
            <SellIcon />
          </ListItemIcon>
          <ListItemText primary="Pending Orders" />
        </ListItem>

        <ListItem
          button
          key="Bill / Invoice Generation"
          sx={{ color: drawerElementColor[6] }}
          onClick={() => router.push("/generatebill")}
        >
          <ListItemIcon sx={{ color: drawerElementColor[6] }}>
            <ReceiptLongIcon />
          </ListItemIcon>
          <ListItemText primary="Bill / Invoice Generation" />
        </ListItem>

        <ListItem
          button
          key="Delivery"
          sx={{ color: drawerElementColor[7] }}
          onClick={() => router.push("/delivery")}
        >
          <ListItemIcon sx={{ color: drawerElementColor[7] }}>
            <DeliveryDiningIcon />
          </ListItemIcon>
          <ListItemText primary="Delivery" />
        </ListItem>
      </List>
      <Divider />
      <List></List>
    </Drawer>
  );
};

export default NavbarDrawer;
