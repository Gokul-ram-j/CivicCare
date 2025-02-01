import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import UserDetails from "./UserDetails";
import UserForm from "./UserForm";
import { View } from "react-native";
import { Text } from "react-native";
const Stack=createNativeStackNavigator();
export default function UserProfileStack() {
  return (
    
      <Stack.Navigator >
        <Stack.Screen name='UserDetails' component={UserDetails} options={{headerShown:false}}/>
        <Stack.Screen name="UserForm" component={UserForm} options={{headerShown:false}}/>
      </Stack.Navigator>
   
  );

}
