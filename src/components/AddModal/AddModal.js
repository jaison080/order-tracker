import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../utils/firebase";
import styles from "./AddModal.module.css";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: "Montserrat",
      textTransform: "none",
    },
  },
});

export default function AddModal(props) {
  async function AddOrder(order) {
    await addDoc(collection(db, "orders"), order);
  }
  const handleClose = () => props.setOpen(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const order = {
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      address: data.get("address"),
      quantity: data.get("quantity"),
      delivery_date: data.get("delivery_date"),
      order_date: data.get("order_date"),
      isCompleted: false,
    };
    AddOrder(order).then(() => {
      handleClose();
      props.settempOrders(order);
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
                        name="name"
                        autoComplete="name"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="email"
                        label="Email"
                        type="email"
                        id="email"
                        autoComplete="email"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
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
                        InputProps={{
                          inputProps: { min: 1 },
                        }}
                        fullWidth
                        name="quantity"
                        label="Quantity"
                        type="number"
                        id="quantity"
                        autoComplete="quantity"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <label>Order Date</label>
                      <br />
                      <input
                        type="date"
                        required
                        pattern="\d{4}-\d{2}-\d{2}"
                        name="order_date"
                        label="Order Date"
                        id="order_date"
                        className={styles.input_date}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <label>Delivery Date</label>
                      <br />
                      <input
                        type="date"
                        className={styles.input_date}
                        required
                        pattern="\d{4}-\d{2}-\d{2}"
                        name="delivery_date"
                        label="Delivery Date"
                        id="delivery_date"
                      />
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Add Order
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
