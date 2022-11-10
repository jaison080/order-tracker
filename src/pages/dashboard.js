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
import db from "../utils/firebase";
function Dashboard() {
  const [orders, setOrders] = useState();
  const [order,setOrder]=useState();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleOpen1 = (order) => {
    setOpen1(true);
    setOrder(order);
  };
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
    getOrders();
  }
  async function completeOrder(id) {
    await setDoc(
      doc(db, "orders", id),
      {
        isCompleted: true,
      },
      { merge: true }
    );
  }
  async function incompleteOrder(id) {
    await setDoc(
      doc(db, "orders", id),
      {
        isCompleted: false,
      },
      { merge: true }
    );
  }
  function editOrder(order)
  {
    <EditModal open={open1} setOpen={setOpen1} order={order} />
  }
  useEffect(() => {
    getOrders();
  }, [orders]);
  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <div>
      <h1>Dashboard</h1>
      <Button onClick={handleOpen}>Add Order</Button>
      <AddModal open={open} setOpen={setOpen} />
      {orders.map((order, index) => {
        return (
          <div key={index}>
            <h2>Order ID : {order.id}</h2>
            <p>Customer Name : {order.name}</p>
            <p>Phone No : {order.phone}</p>
            <p>Email : {order.email}</p>
            <p>Address : {order.address}</p>
            <p>Delivery Date : {order.delivery_date}</p>
            <p>Order Date : {order.order_date}</p>
            <p>Quantity : {order.quantity}</p>
            {order.isCompleted ? (
              <button onClick={() => incompleteOrder(order.id)}>
                Mark as Incomplete
              </button>
            ) : (
              <button onClick={() => completeOrder(order.id)}>
                Mark as Completed
              </button>
            )}

            <button onClick={() => deleteOrder(order.id)}>Delete Order</button>
            <button onClick={()=>{handleOpen1(order)}}>Edit Order</button>
          </div>
        );
      })}
      <EditModal open={open1} setOpen={setOpen1} order={order} />
    </div>
  );
}
export default Dashboard;
