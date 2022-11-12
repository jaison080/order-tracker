import Navbar from "../components/Navbar/Navbar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Head from "next/head";
import { useEffect, useState } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import app, { db } from "../utils/firebase";
import { Button } from "@mui/material";
import { RiDeleteBin6Fill } from "react-icons/ri";
import AddCityModal from "../components/AddCityModal/AddCityModal";
import EditCityModal from "../components/EditCityModal/EditCityModal";
import styles from "../styles/Cities.module.css";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
function Cities() {
  const [signedInUser, setSignedInUser] = useState();
  const [cities, setCities] = useState();
  const [loading, setLoading] = useState(true);
  const [tempOrders, settempOrders] = useState();
  const [selectedCity, setSelectedCity] = useState();
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleOpen1 = () => {
    setOpen1(true);
  };
  const auth = getAuth(app);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setSignedInUser(user);
      } else {
        router.push("/");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  async function getCities() {
    let temp = [];
    const querySnapshot = await getDocs(collection(db, "cities"));
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      data.id = doc.id;
      temp.push(data);
    });
    setCities(temp);
    setLoading(false);
  }
  useEffect(() => {
    getCities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempOrders]);
  async function deleteCity(id) {
    await deleteDoc(doc(db, "cities", id));
    settempOrders(id);
  }
  if (loading) {
    return (
      <>
        <Head>
          <title>Order Tracker | Cities</title>
        </Head>
        <div className={styles.loader}>
          <h5>Loading...</h5>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Order Tracker | Cities</title>
      </Head>
      <Navbar user={signedInUser} auth={auth} />
      <div className={styles.cities_container}>
        <div className={styles.header}>
          <h1>Cities</h1>
          <div className={styles.header_buttons}>
            <Button
              onClick={handleOpen}
              variant="contained"
              sx={{ display: "flex", columnGap: "15px" }}
            >
              <FaPlus size={20} /> Add City
            </Button>
          </div>
        </div>

        <div className={styles.table_container}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>City ID</th>
                <th>City Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((singleCity, index) => {
                return (
                  <tr key={index}>
                    <td>{singleCity.id}</td>
                    <td>{singleCity.name}</td>
                    <td>
                      <div className={styles.action_buttons}>
                        <Button
                          title="Delete City"
                          onClick={() => deleteCity(singleCity.id)}
                          variant="contained"
                          color="error"
                        >
                          <RiDeleteBin6Fill size={20} />
                        </Button>
                        <Button
                          title="Edit City"
                          onClick={() => {
                            setSelectedCity(singleCity);
                            handleOpen1();
                          }}
                          variant="contained"
                          color="secondary"
                        >
                          <FaEdit size={20} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot></tfoot>
          </table>
        </div>
        <AddCityModal
          open={open}
          setOpen={setOpen}
          settempOrders={settempOrders}
        />
        <EditCityModal
          open={open1}
          setOpen={setOpen1}
          city={selectedCity}
          settempOrders={settempOrders}
        />
      </div>
    </>
  );
}
export default Cities;
