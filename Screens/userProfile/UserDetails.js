import { View, Text, StyleSheet, SafeAreaView, Button, TouchableOpacity } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { firestore, auth } from "../auth/firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import React, { useState, useEffect } from "react";
import ProfileImgContainer from "./ProfileImgContainer";
import { useNavigation } from "@react-navigation/native";

const UserDetails = () => {
  const [userInfo, setUserInfo] = useState({});
  const auth = getAuth();
  const navigation = useNavigation();
  // Getting details
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(firestore, "userDetails", user.email);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserInfo({...docSnap.data(),userEmail:user.email});
            console.log("from userdetails",docSnap.data())
          } else {
            console.log("No such document!");
            setUserInfo({});
          }
        } catch (error) {
          console.error("Error fetching document:", error);
          setUserInfo({});
        }
      } else {
        console.log("No user is logged in");
        setUserInfo(null);
      }
    });

    return () => unsubscribe(); // Cleanup function to prevent memory leaks
  }, [auth, firestore]);

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigation.navigate("Dashboard");
    });
  };
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <ProfileImgContainer />
        <TouchableOpacity
          style={[styles.Btn, { backgroundColor: "red", marginVertical: 10 }]}
          onPress={() => navigation.navigate("UserForm",{userEmail:userInfo.userEmail})}
        >
          <Text style={{ color: "white", textAlign: "center", padding: 10 }}>
            Edit
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.Btn,{backgroundColor:'#5d7ef7'}]}
          onPress={handleLogout}
        >
          <Text style={{color:'white',  textAlign: "center", padding: 10 }}>
            LogOut
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginHorizontal: "auto",
    paddingVertical: 50,
    height: "100%",
    maxWidth: 400,
  },
  Btn: {
    width: "80%",
    marginHorizontal: "auto",
  },
  profileImg: {
    width: 150,
    height: 150,
    borderRadius: 80,
    overflow: "hidden",
    borderWidth: 1,
    marginVertical: 10,
    marginHorizontal: "auto",
  },
});

export default UserDetails;
