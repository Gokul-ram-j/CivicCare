import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import HomeScreen from "./HomeScreen";
import SOSEmergencyMsg from "./SOSEmergencyMsg";


const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SOSEmergencyMsg"
        component={SOSEmergencyMsg}
        options={{ headerShown: false }}
      />
      
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
