import { Button } from "@mui/material";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  getFirestore,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import AddModal from "../components/AddModal/AddModal";
import EditModal from "../components/EditModal/EditModal";
import styles from "../styles/Dashboard.module.css";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar/Navbar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../utils/firebase";
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
      }
      else
      {
        router.push("/");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
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
    settempOrders(id.isCompleted);
  }
  async function incompleteOrder(id) {
    await setDoc(
      doc(db, "orders", id),
      {
        isCompleted: false,
      },
      { merge: true }
    );
    settempOrders(id);
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
      <div className={styles.loader}>
        <h5>Loading...</h5>
      </div>
    );
  }
  return (
    <>
      <Navbar user={signedInUser} auth={auth} />
      <div className={styles.dashboard_container}>
        <div className={styles.header}>
          <h1>Dashboard</h1>
          <div className={styles.header_buttons}>
            <Button onClick={completedPage} variant="contained" color="success">
              View Completed Orders
            </Button>
            <Button onClick={handleOpen} variant="contained">
              Add Order
            </Button>
          </div>
        </div>

        <div>
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
                    <td>{singleOrder.order_date}</td>
                    <td>{singleOrder.delivery_date}</td>
                    <td>
                      <div className={styles.action_buttons}>
                        {singleOrder.isCompleted ? (
                          <Button
                            onClick={() => incompleteOrder(singleOrder.id)}
                            variant="contained"
                            color="warning"
                          >
                            Mark as Incomplete
                          </Button>
                        ) : (
                          <Button
                            onClick={() => completeOrder(singleOrder.id)}
                            variant="contained"
                            color="success"
                          >
                            Mark as Completed
                          </Button>
                        )}

                        <Button
                          onClick={() => deleteOrder(singleOrder.id)}
                          variant="contained"
                          color="error"
                        >
                          Delete Order
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedOrder(singleOrder);
                            handleOpen1();
                          }}
                          variant="contained"
                          color="secondary"
                        >
                          Edit Order
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
