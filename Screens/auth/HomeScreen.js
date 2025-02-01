// native component
import {  View, Text } from "react-native";
// firebase
import { getAuth, onAuthStateChanged } from "firebase/auth";
// style
import { StyleSheet } from "react-native";
// user component
import { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


const Stack = createNativeStackNavigator();

export default function HomeScreen() { 
  
  const [currentUser,setCurrentUser]=useState('')
  const auth = getAuth();


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
