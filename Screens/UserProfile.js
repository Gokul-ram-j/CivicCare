import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView, StyleSheet } from "react-native";
import { Text, View, Button,useWindowDimensions } from "react-native";
import {auth} from "./auth/firebase";
import { signOut } from "firebase/auth";
import { StatusBar } from "expo-status-bar";
export default function UserProfile() {
  const {width}=useWindowDimensions()
  const handleLogout = () => {
    signOut(auth).then(() => {
      navigation.navigate("Dashboard");
    });
  };
  return (
    <SafeAreaView>
      <View style={{width}}>
        
        <View style={{width:300,marginHorizontal:'auto',paddingVertical:50}}>

        <Button style={styles.button} title="logout" onPress={handleLogout}/>
        </View>
      </View>
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  
});
