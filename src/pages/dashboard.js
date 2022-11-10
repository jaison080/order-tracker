import { Button } from "@mui/material";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import AddModal from "../components/AddModal/AddModal";
import EditModal from "../components/EditModal/EditModal";
import db from "../utils/firebase";
function Dashboard() {
  const [orders, setOrders] = useState();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleOpen1 = () => setOpen1(true);
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
            <button onClick={() => deleteOrder(order.id)}>Delete Order</button>
            <button onClick={handleOpen1}>Edit Order</button>
            <EditModal open={open1} setOpen={setOpen1} order={order} />
          </div>
        );
      })}
    </div>
  );
}
export default Dashboard;
