import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { InputLabel, MenuItem, Select, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { useEffect, useState } from "react";
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

export default function AddCustomerModal(props) {
  const [cities, setCities] = useState();

  const [city, setCity] = useState(cities?.[0]?.name);
  async function getCities() {
    let temp = [];
    const querySnapshot = await getDocs(collection(db, "cities"));
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      data.id = doc.id;
      temp.push(data);
    });
    setCities(temp);
  }
  useEffect(() => {
    getCities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (event) => {
    setCity(event.target.value);
  };

  async function AddCustomer(customer) {
    await addDoc(collection(db, "customers"), customer);
  }
  const handleClose = () => props.setOpen(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const customer = {
      name: data.get("name"),
      phone: data.get("phone"),
      email: data.get("email"),
      address: data.get("address"),
      city: city,
    };
    AddCustomer(customer).then(() => {
      handleClose();
      props.settempOrders(customer);
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
                        id="phone"
                        type="number"
                        label="Phone Number"
                        name="phone"
                        autoComplete="phone"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="email"
                        type="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="address"
                        label="Address"
                        name="address"
                        autoComplete="address"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <InputLabel id="demo-simple-select-label">
                        City
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        fullWidth
                        value={city}
                        onChange={handleChange}
                      >
                        {cities?.map((city) => {
                          return (
                            <MenuItem key={city.id} value={city.name}>
                              {city.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Add Customer
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
