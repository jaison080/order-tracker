import { Button } from "@mui/material";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from "../styles/Products.module.css";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar/Navbar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../utils/firebase";
import { FaEdit, FaPlus } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import Head from "next/head";
import AddProductModal from "../components/AddProductModal/AddProductModal";
import EditProductModal from "../components/EditProductModal/EditProductModal";
function Products() {
  const [signedInUser, setSignedInUser] = useState();
  const router = useRouter();
  const [products, setProducts] = useState();
  const [tempOrders, settempOrders] = useState();
  const [selectedProduct, setSelectedProduct] = useState();
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
  async function getProducts() {
    let temp = [];
    const querySnapshot = await getDocs(collection(db, "products"));
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      data.id = doc.id;
      temp.push(data);
    });
    setProducts(temp);
    setLoading(false);
  }

  async function deleteProduct(id) {
    await deleteDoc(doc(db, "products", id));
    settempOrders(id);
  }
  useEffect(() => {
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempOrders]);
  if (loading) {
    return (
      <>
        <Head>
          <title>Order Tracker | Products</title>
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
        <title>Order Tracker | Products</title>
      </Head>
      <Navbar user={signedInUser} auth={auth} />
      <div className={styles.products_container}>
        <div className={styles.header}>
          <h1>All Products</h1>
          <div className={styles.header_buttons}>
            <Button
              onClick={handleOpen}
              variant="contained"
              sx={{ display: "flex", columnGap: "15px" }}
            >
              <FaPlus size={20} /> Add Product
            </Button>
          </div>
        </div>

        <div className={styles.table_container}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Product Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((singleProduct, index) => {
                return (
                  <tr key={index}>
                    <td>{singleProduct.id}</td>
                    <td>{singleProduct.name}</td>
                    <td>{singleProduct.price}</td>
                    <td>
                      <div className={styles.action_buttons}>
                        <Button
                          title="Delete Product"
                          onClick={() => deleteProduct(singleProduct.id)}
                          variant="contained"
                          color="error"
                        >
                          <RiDeleteBin6Fill size={20} />
                        </Button>
                        <Button
                          title="Edit Product"
                          onClick={() => {
                            setSelectedProduct(singleProduct);
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
        <AddProductModal
          open={open}
          setOpen={setOpen}
          settempOrders={settempOrders}
        />
        <EditProductModal
          open={open1}
          setOpen={setOpen1}
          product={selectedProduct}
          settempOrders={settempOrders}
        />
      </div>
    </>
  );
}
export default Products;
