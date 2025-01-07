import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from "@react-navigation/native";

import React, { Component } from 'react'
import { Text, View } from 'react-native'



const Stack=createNativeStackNavigator()

export default function Application() {
  
    return (
      // <NavigationContainer>
      //   <Stack.Screen/>
      // </NavigationContainer>
      <View>
        <Text>Application Screen</Text>
      </View>
    )
  
}
