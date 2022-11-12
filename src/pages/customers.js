import { getAuth, onAuthStateChanged } from "firebase/auth";
import Head from "next/head";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import app from "../utils/firebase";

function Customers() {
  const [signedInUser, setSignedInUser] = useState();
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
  return (
    <>
      <Head>
        <title>Order Tracker | Customers</title>
      </Head>
      <Navbar user={signedInUser} auth={auth} />
      <h1>Customers</h1>
    </>
  );
}
export default Customers;
