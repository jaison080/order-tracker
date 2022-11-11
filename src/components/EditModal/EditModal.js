import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../../utils/firebase";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
const theme = createTheme();
export default function EditModal(props) {
  console.log(props.order);
  const [name, setName] = useState(props.order?.name);
  const [email, setEmail] = useState(props.order?.email);
  const [phone, setPhone] = useState(props.order?.phone);
  const [address, setAddress] = useState(props.order?.address);
  const [quantity, setQuantity] = useState(props.order?.quantity);
  const [delivery_date, setDeliveryDate1] = useState(dayjs((props.order?.delivery_date), "DD/MM/YYYY"));
  const [order_date, setOrderDate1] = useState(dayjs((props.order?.order_date),"DD/MM/YYYY"));
  const handleChange = (newValue) => {
    setOrderDate1(newValue);
  };
  const handleChange1 = (newValue) => {
    setDeliveryDate1(newValue);
  };
  async function EditOrder(order, id) {
    await setDoc(doc(db, "orders", id), order);
  }

  const handleClose = () => props.setOpen(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const updateOrder = {
      name: name || props.order?.name,
      email: email || props.order?.email,
      phone: phone || props.order?.phone,
      address: address || props.order?.address,
      quantity: quantity || props.order?.quantity,
      delivery_date: delivery_date.format("DD/MM/YYYY") || props.order?.delivery_date,
      order_date: order_date.format("DD/MM/YYYY") || props.order?.order_date,
    };
    EditOrder(updateOrder, props.order.id).then(() => {
      handleClose();
      props.settempOrders(updateOrder);
    });
  };
  return (
    <div>
      <Modal
        open={props.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 3 }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="name"
                        label="Name"
                        value={name ? name : props.order?.name}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                        name="name"
                        autoComplete="name"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="email"
                        value={email ? email : props.order?.email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        label="Email"
                        type="email"
                        id="email"
                        autoComplete="email"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        value={phone ? phone : props.order?.phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                        }}
                        fullWidth
                        name="phone"
                        label="Phone No:"
                        type="number"
                        id="phone"
                        autoComplete="phone"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        value={address ? address : props.order?.address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                        }}
                        name="address"
                        label="Address"
                        type="text"
                        id="address"
                        autoComplete="address"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="quantity"
                        value={quantity ? quantity : props.order?.quantity}
                        onChange={(e) => {
                          setQuantity(e.target.value);
                        }}
                        label="Quantity"
                        type="number"
                        id="quantity"
                        autoComplete="quantity"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                        label="Order Date"
                        inputFormat="DD/MM/YYYY"
                        value={order_date ? order_date : props.order?.order_date}
                        onChange={handleChange}
                        renderInput={(params) => <TextField 
                          fullWidth {...params} />}
                      />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                        label="Delivery Date"
                        inputFormat="DD/MM/YYYY"
                        value={delivery_date ? delivery_date : props.order?.delivery_date}
                        onChange={handleChange1}
                        renderInput={(params) => <TextField 
                          fullWidth {...params} />}
                      />
                      </LocalizationProvider>
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Update Order
                  </Button>
                </Box>
              </Box>
            </Container>
          </ThemeProvider>
        </Box>
      </Modal>
    </div>
  );
}
