import { Button } from "@mui/material";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import app, { db } from "../utils/firebase";
import styles from "../styles/Login.module.css";
import { doc, getDoc } from "firebase/firestore";
import Head from "next/head";

function Login() {
  const router = useRouter();
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  async function getUsers() {
    const querySnapshot = await getDoc(doc(db, "users", "authorizedUsers"));
    setUsers(querySnapshot.data());
    setLoading(false);
  }
  function signInWithGoogle() {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        if (user) {
          if (users.allowedEmails.includes(user.email)) {
            router.push("/dashboard");
          } else {
            alert("Unauthorized User");
            auth.signOut();
          }
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  }
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/dashboard");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (loading) {
    return (
      <>
        <Head>
          <title>Order Tracker | Login</title>
        </Head>
        <div className={styles.loader}>
          <h5>Loading...</h5>
        </div>
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>Order Tracker | Login</title>
        </Head>
        <div className={styles.login_container}>
          <h1>ORDER TRACKER</h1>
          <Button onClick={signInWithGoogle} variant="contained">
            Sign in with Google
          </Button>
        </div>
      </>
    );
  }
}
export default Login;
