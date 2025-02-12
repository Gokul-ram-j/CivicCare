import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { firestore, auth } from "../auth/firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import React, { useState, useEffect } from "react";
import ProfileImgContainer from "./ProfileImgContainer";
import { useNavigation } from "@react-navigation/native";
import UserDetailContainer from "./UserDetailContainer";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
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
            setUserInfo({ ...docSnap.data(), userEmail: user.email });
            // console.log("from userdetails", docSnap.data());
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
    signOut(auth);
  };
  return (
    <SafeAreaView>
      <LinearGradient
        colors={["transparent","rgba(81, 123, 123, 0.4)"]}
        locations={[0,0.9]}
      >
        <View style={styles.wrapper}>
          <Text style={{fontSize:24,textDecorationStyle:'solid',textDecorationLine:'underline'}}>Your Profile</Text>
          <View style={styles.container}>
            <ProfileImgContainer />
            {userInfo && <UserDetailContainer details={userInfo} />}
            <TouchableOpacity
              style={[
                styles.Btn,
                { backgroundColor: "red",flexDirection:'row',alignItems:'center',justifyContent:'center' },
              ]}
              onPress={() =>
                navigation.navigate("UserForm", {
                  userEmail: userInfo.userEmail,
                })
              }
            >
              <Text
                style={{ color: "white", textAlign: "center", padding: 10,fontSize:18, }}
              >
                <FontAwesome
                  name="edit"
                  size={24}
                  style={{ marginRight: 10 }}
                />
                Edit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.Btn, { backgroundColor: "#5d7ef7",flexDirection:'row',alignItems:'center',justifyContent:'center' }]}
              onPress={handleLogout}
            >
              <Text
                style={{ color: "white", textAlign: "center", padding: 10,fontSize:18, }}
              >
                <MaterialCommunityIcons name="logout" size={24}  />
                LogOut
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  container: {
    width: "90%",
    height: "90%",
    paddingVertical: 10,
    elevation: 5,
  },
  Btn: {
    width: "80%",
    marginHorizontal: "auto",
    marginVertical:5,
    borderRadius:5
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
