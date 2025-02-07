// React & React Native imports
import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
// Navigation imports
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// Icon imports
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
// Screen imports
import SignUpScreen from "./Screens/auth/SignUpScreen";
import LoginScreen from "./Screens/auth/LoginScreen";
import HomeScreen from "./Screens/auth/HomeScreen";
import UserProfileStack from "./Screens/userProfile/UserProfileStack";
import ApplicationStack from "./Screens/applicationScreens/ApplicationStack";
import OnboardScreen from "./Screens/OnboardingScreen/OnboardScreen";
// Firebase imports
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Screens/auth/firebase";
import CommunityStack from "./Screens/communityForum/CommunityStack";

// Create navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [isUserLogged, setIsUserLogged] = useState(false);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsUserLogged(!!user); // True if user is logged in, false otherwise
    });

    return unsubscribe; // Clean up subscription on unmount
  }, []);

  // Stack navigator for authentication flow
  const AuthStack = () => (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );

  // Tab navigator for the main app flow
  const AppTabs = () => (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
          headerShown:false
        }}
      />
      <Tab.Screen
        name="ApplicationStack"
        component={ApplicationStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="application-edit"
              size={size}
              color={color}
            />
          ),
          headerShown:false
        }}
      />
      <Tab.Screen
        name="CommunityStack"
        component={CommunityStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="group" size={size} color={color} />
          ),
          headerShown:false,
          tabBarLabel: "Community",
        }}
      />
      <Tab.Screen
        name="UserProfile"
        component={UserProfileStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
          headerShown:false
        }}
      />
    </Tab.Navigator>
  );

  // Stack navigator for onboarding + main app flow
  const MainStack = () => (
    <Stack.Navigator
      initialRouteName="OnboardScreen"
    >
      <Stack.Screen options={{title:"Welcome Chief"}}  name="OnboardScreen" component={OnboardScreen}  />
      <Stack.Screen options={{title:'CivicCare'}} name="AppTabs" component={AppTabs} />
    </Stack.Navigator>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        {isUserLogged ? <MainStack /> : <AuthStack />}
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
