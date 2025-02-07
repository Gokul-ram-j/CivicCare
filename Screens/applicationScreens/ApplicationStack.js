import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { Text, View,Button } from 'react-native'
import UserApplication from './UserApplication';
import ApplicationForm from './ApplicationForm';

const Stack=createNativeStackNavigator()

export default function ApplicationStack() {
  
    return (
      <Stack.Navigator initialRouteName='UserApplication'>
        <Stack.Screen options={{headerShown:false}} name='UserApplication' component={UserApplication}/>
        <Stack.Screen options={{headerShown:false}} name='ApplicationForm' component={ApplicationForm}/>
      </Stack.Navigator>
     
    )
  
}
