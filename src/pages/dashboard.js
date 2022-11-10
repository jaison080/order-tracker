import { Button } from "@mui/material";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import AddModal from "../components/AddModal/AddModal";
import db from "../utils/firebase";
function Dashboard() {
  const [orders, setOrders] = useState();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

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
            <h2>{order.name}</h2>
            <h3>{order.id}</h3>
            <p>{order.email}</p>
            <p>{order.address}</p>
            <p>{order.phone}</p>
            <button onClick={() => deleteOrder(order.id)}>Delete Order</button>
          </div>
        );
      })}
    </div>
  );
}
export default Dashboard;
