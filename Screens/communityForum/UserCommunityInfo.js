import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "../auth/firebase";
import { useState,useEffect } from "react";
import { doc, updateDoc,getDoc, arrayRemove } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export function UserCommunityInfo() {
  // const navigation
  const navigation=useNavigation()
  // Storing User Email
  const [userEmail, setUserEmail] = useState({});
  // Storing User Info
  const [userInfo, setUserInfo] = useState({});
  // Getting details
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const docRef = doc(firestore, "userDetails", user.email);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setUserEmail(user.email)
              setUserInfo({...docSnap.data()});
              console.log("from communityInfo",docSnap.data())
            } else {
              console.log("No such document!");
              setUserInfo({});
            }
          } catch (error) {
            console.error("Error fetching document:", error);
            setUserInfo({});
          }
        } 
      });
  
      return () => unsubscribe(); // Cleanup function to prevent memory leaks
    },[]);
      
    

  // handling leaving community action
  const handleLeaveCommunity = async () => {
    if (!userEmail) {
      Alert.alert("Error", "User email is required.");
      return;
    }
    try {
      const userDocRef = doc(firestore, "userDetails",userEmail);
      const communityRef=doc(firestore,'community',userInfo.community)
      // updating user doc
      await updateDoc(userDocRef, {
        community: "",
      })
      // updating community doc
      await updateDoc(communityRef, {
        members: arrayRemove(userEmail)
      }).then(()=>navigation.navigate('CommunityList'))
    } catch (error) {
      console.error("Error leaving community:", error);
    }
  };
  return (
    <SafeAreaView>
      <View>
        <Text>Happy ,to welcome you to </Text>
        <Text style={styles.head}>{userInfo.community}</Text>
        <Button title="leave community" onPress={handleLeaveCommunity}/>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  head:{
    fontSize:25
  }
});


export default UserCommunityInfo;
