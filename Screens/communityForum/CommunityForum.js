import { StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { auth, firestore } from "../auth/firebase";
import UserCommunityInfo from "./UserCommunityInfo";
import CommunityList from "./CommunityList";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

export default function CommunityForum() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    let unsubscribeAuth;
    let unsubscribeDoc;

    // Listen for authentication state changes
    unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const docRef = doc(firestore, "userDetails", user.email);

        // Listen to Firestore document in real time
        unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserInfo({ ...docSnap.data(), userEmail: user.email });
            console.log("Realtime update from community forum", docSnap.data());
          } else {
            console.log("No such document!");
            setUserInfo({});
          }
        }, (error) => {
          console.error("Error fetching document:", error);
          setUserInfo({});
        });
      } else {
        console.log("No user is logged in");
        setUserInfo(null);
      }
    });

    // Cleanup function to prevent memory leaks
    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  return (
    <>
      {userInfo?.community ? <UserCommunityInfo /> : <CommunityList />}
    </>
  );
}

const styles = StyleSheet.create({});
