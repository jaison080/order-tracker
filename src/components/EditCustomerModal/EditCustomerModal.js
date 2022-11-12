import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../utils/firebase";
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
export default function EditCustomerModal(props) {
  const [name, setName] = useState(props.customer?.name);
  const [phone, setPhone] = useState(props.customer?.phone);
  const [email, setEmail] = useState(props.customer?.email);
  const [address, setAddress] = useState(props.customer?.address);
  const [city, setCity] = useState(props.customer?.city);
  const [role, setRole] = useState(props.role);
  const [cities, setCities] = useState();
  const handleChangeRole = (event) => {
    setRole(event.target.value);
  };
  useEffect(() => {
    getCities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleChange = (event) => {
    setCity(event.target.value);
  };
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

  const handleClose = () => props.setOpen(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const updateCustomer = {
      name: name || props.customer?.name,
      phone: phone || props.customer?.phone,
      email: email || props.customer?.email,
      address: address || props.customer?.address,
      city: city || props.customer?.city,
      role: role || props.customer?.role,
    };
    EditCustomer(updateCustomer, props.customer.id).then(() => {
      handleClose();
      props.settempOrders(updateCustomer);
    });
  };
  async function EditCustomer(customer, id) {
    await setDoc(doc(db, "customers", id), customer);
  }
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
                        value={name ? name : props.customer?.name}
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
                        id="phone"
                        type="number"
                        label="Phone Number"
                        name="phone"
                        value={phone ? phone : props.customer?.phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                        }}
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
                        value={email ? email : props.customer?.email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        autoComplete="email"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="address"
                        value={address ? address : props.customer?.address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                        }}
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
                        value={city ? city : props.customer?.city}
                        fullWidth
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
                    <Grid item xs={12}>
                      <InputLabel>Role</InputLabel>
                      <RadioGroup
                        name="Role"
                        row
                        value={(role)?role:props.customer?.role}
                        onChange={handleChangeRole}
                      >
                        <FormControlLabel
                          value="dealer"
                          control={<Radio />}
                          label="Dealer"
                        />
                        <FormControlLabel
                          value="customer"
                          control={<Radio />}
                          label="Customer"
                        />
                      </RadioGroup>
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Update Member
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
