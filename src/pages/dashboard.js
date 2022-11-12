import { Button } from "@mui/material";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import AddModal from "../components/AddModal/AddModal";
import EditModal from "../components/EditModal/EditModal";
import styles from "../styles/Dashboard.module.css";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar/Navbar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../utils/firebase";
import { FaCheck, FaEdit, FaPlus } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { RiDeleteBin6Fill } from "react-icons/ri";
import Head from "next/head";
function Dashboard() {
  const [signedInUser, setSignedInUser] = useState();
  const router = useRouter();
  const [orders, setOrders] = useState();
  const [tempOrders, settempOrders] = useState();
  const [selectedOrder, setSelectedOrder] = useState();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleOpen1 = () => {
    setOpen1(true);
  };
  const auth = getAuth();
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
  async function getOrders() {
    let temp = [];
    const querySnapshot = await getDocs(collection(db, "orders"));
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      data.id = doc.id;
      temp.push(data);
    });
    setOrders(temp);
    setLoading(false);
  }

  async function deleteOrder(id) {
    await deleteDoc(doc(db, "orders", id));
    settempOrders(id);
  }
  async function completeOrder(id) {
    await setDoc(
      doc(db, "orders", id),
      {
        isCompleted: true,
      },
      { merge: true }
    );
    window.location.reload();
  }
  async function incompleteOrder(id) {
    await setDoc(
      doc(db, "orders", id),
      {
        isCompleted: false,
      },
      { merge: true }
    );
    window.location.reload();
  }
  useEffect(() => {
    getOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempOrders]);
  function completedPage() {
    router.push("/completed");
  }
  if (loading) {
    return (
      <>
        <Head>
          <title>Order Tracker | Dashboard</title>
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
        <title>Order Tracker | Dashboard</title>
      </Head>
      <Navbar user={signedInUser} auth={auth} />
      <div className={styles.dashboard_container}>
        <div className={styles.header}>
          <h1>Dashboard</h1>
          <div className={styles.header_buttons}>
            <Button onClick={completedPage} variant="contained" color="success">
              View Completed Orders
            </Button>
            <Button
              onClick={handleOpen}
              variant="contained"
              sx={{ display: "flex", columnGap: "15px" }}
            >
              <FaPlus size={20} /> Add Order
            </Button>
          </div>
        </div>

        <div className={styles.table_container}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Customer Email</th>
                <th>Customer Phone</th>
                <th>Customer Address</th>
                <th>Quantity</th>
                <th>Order Date</th>
                <th>Delivery Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((singleOrder, index) => {
                return (
                  <tr key={index}>
                    <td>{singleOrder.id}</td>
                    <td>{singleOrder.name}</td>
                    <td>{singleOrder.phone}</td>
                    <td>{singleOrder.email}</td>
                    <td>{singleOrder.address}</td>
                    <td>{singleOrder.quantity}</td>
                    <td>
                      {new Date(singleOrder.order_date).toLocaleDateString()}
                    </td>
                    <td>
                      {new Date(singleOrder.delivery_date).toLocaleDateString()}
                    </td>
                    <td>
                      <div className={styles.action_buttons}>
                        {singleOrder.isCompleted ? (
                          <Button
                            onClick={() => incompleteOrder(singleOrder.id)}
                            variant="contained"
                            color="warning"
                          >
                            <ImCross size={20} />
                          </Button>
                        ) : (
                          <Button
                            onClick={() => completeOrder(singleOrder.id)}
                            variant="contained"
                            color="success"
                          >
                            <FaCheck size={20} />
                          </Button>
                        )}

                        <Button
                          onClick={() => deleteOrder(singleOrder.id)}
                          variant="contained"
                          color="error"
                        >
                          <RiDeleteBin6Fill size={20} />
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedOrder(singleOrder);
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
        <AddModal open={open} setOpen={setOpen} settempOrders={settempOrders} />
        <EditModal
          open={open1}
          setOpen={setOpen1}
          order={selectedOrder}
          settempOrders={settempOrders}
        />
      </div>
    </>
  );
}
export default Dashboard;
