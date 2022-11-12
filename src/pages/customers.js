import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import Head from "next/head";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import app, { db } from "../utils/firebase";
import styles from "../styles/Customers.module.css";
import { Button } from "@mui/material";
import { FaEdit, FaPlus } from "react-icons/fa";
import AddCustomerModal from "../components/AddCustomerModal/AddCustomerModal";
import EditCustomerModal from "../components/EditCustomerModal/EditCustomerModal";
import { RiDeleteBin6Fill } from "react-icons/ri";

function Customers() {
  const [signedInUser, setSignedInUser] = useState();
  const [customers, setCustomers] = useState();
  const [loading, setLoading] = useState(true);
  const [tempOrders, settempOrders] = useState();
  const [selectedCustomer, setSelectedCustomer] = useState();
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
  async function getCustomers() {
    let temp = [];
    const querySnapshot = await getDocs(collection(db, "customers"));
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      data.id = doc.id;
      temp.push(data);
    });
    setCustomers(temp);
    setLoading(false);
  }
  useEffect(() => {
    getCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempOrders]);
  async function deleteCustomer(id) {
    await deleteDoc(doc(db, "customers", id));
    settempOrders(id);
  }
  if (loading) {
    return (
      <>
        <Head>
          <title>Order Tracker | Customers</title>
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
        <title>Order Tracker | Customers</title>
      </Head>
      <Navbar user={signedInUser} auth={auth} />
      <div className={styles.customers_container}>
        <div className={styles.header}>
          <h1>Customers</h1>
          <div className={styles.header_buttons}>
            <Button
              onClick={handleOpen}
              variant="contained"
              sx={{ display: "flex", columnGap: "15px" }}
            >
              <FaPlus size={20} /> Add Customer
            </Button>
          </div>
        </div>

        <div className={styles.table_container}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Customer Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th>City</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((singleCustomer, index) => {
                return (
                  <tr key={index}>
                    <td>{singleCustomer.id}</td>
                    <td>{singleCustomer.name}</td>
                    <td>{singleCustomer.phone}</td>
                    <td>{singleCustomer.email}</td>
                    <td>{singleCustomer.address}</td>
                    <td>{singleCustomer.city}</td>
                    <td>
                      <div className={styles.action_buttons}>
                        <Button
                          title="Delete Customer"
                          onClick={() => deleteCustomer(singleCustomer.id)}
                          variant="contained"
                          color="error"
                        >
                          <RiDeleteBin6Fill size={20} />
                        </Button>
                        <Button
                          title="Edit Customer"
                          onClick={() => {
                            setSelectedCustomer(singleCustomer);
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
        <AddCustomerModal
          open={open}
          setOpen={setOpen}
          settempOrders={settempOrders}
        />
        <EditCustomerModal
          open={open1}
          setOpen={setOpen1}
          customer={selectedCustomer}
          settempOrders={settempOrders}
        />
      </div>
    </>
  );
}
export default Customers;
