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
  const [tempOrders, settempOrders] = useState();
  const [selectedOrder, setSelectedOrder] = useState();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleOpen1 = () => {
    setOpen1(true);
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
  }, [tempOrders]);
  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <div>
      <h1>Dashboard</h1>
      <Button onClick={handleOpen} variant="contained">
        Add Order
      </Button>
      <AddModal open={open} setOpen={setOpen} settempOrders={settempOrders} />
      {orders.map((singleOrder, index) => {
        return (
          <div key={index}>
            <h2>Order ID : {singleOrder.id}</h2>
            <p>Customer Name : {singleOrder.name}</p>
            <p>Phone No : {singleOrder.phone}</p>
            <p>Email : {singleOrder.email}</p>
            <p>Address : {singleOrder.address}</p>
            <p>Delivery Date : {singleOrder.delivery_date}</p>
            <p>Order Date : {singleOrder.order_date}</p>
            <p>Quantity : {singleOrder.quantity}</p>
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
        );
      })}
      <EditModal
        open={open1}
        setOpen={setOpen1}
        order={selectedOrder}
        settempOrders={settempOrders}
      />
    </div>
  );
}
export default Dashboard;
