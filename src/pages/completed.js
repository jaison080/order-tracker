import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from "../styles/Completed.module.css";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar/Navbar";
import app from "../utils/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
function Completed() {
  const db = getFirestore(app);
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const signedInUser = user;
    }
    else
    {
      router.push("/");
    }
  });
  const router = useRouter();
  const [orders, setOrders] = useState();
  const [loading, setLoading] = useState(true);
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
  useEffect(() => {
    getOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function dashboardPage() {
    router.push("/dashboard");
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
      <Navbar />
      <div className={styles.completed_container}>
        <div className={styles.header}>
          <h1>Completed Orders</h1>
          <Button onClick={dashboardPage} variant="contained" color="success">
            View All Orders
          </Button>
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
              </tr>
            </thead>
            <tbody>
              {orders.map((singleOrder, index) => {
                if (singleOrder.isCompleted) {
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
                    </tr>
                  );
                }
              })}
            </tbody>
            <tfoot></tfoot>
          </table>
        </div>
      </div>
    </>
  );
}
export default Completed;