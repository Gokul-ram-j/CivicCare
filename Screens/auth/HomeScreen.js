// native component
import {  View, Text } from "react-native";
// firebase
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "./firebase";
// style
import { StyleSheet } from "react-native";
// user component
import { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";


const Stack = createNativeStackNavigator();

export default function HomeScreen() { 
  
  const [currentUser,setCurrentUser]=useState('')
  const auth = getAuth();

  async function getUserDetails(docId) {
    try {
      // Reference to the specific document in 'userDetails' collection
      const docRef = doc(firestore, 'userDetails', docId);
  
      // Fetch the document
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        // Document found, return its data
        return docSnap.data();
      } else {
        // Document not found
        console.log(`Document with ID ${docId} does not exist.`);
        return null;
      }
    } catch (error) {
      // Handle errors (e.g., network issues, permission errors)
      console.error('Error fetching document:', error);
      throw error;
    }
  }

  onAuthStateChanged(auth, (user) => {
  if (user) {
    setCurrentUser(user.email);
  } else {
    setCurrentUser('')
  }
});
  return (
    
     <View style={{paddingHorizontal:10}}>
      <Text>hello {currentUser}</Text>

     </View>
    
  );
}

const styles = StyleSheet.create({
  
});
