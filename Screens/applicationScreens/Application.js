import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { Text, View,Button } from 'react-native'

const Comp1=()=>{
  const navigation=useNavigation()
  const handlePress=()=>{
    navigation.navigate("comp2")
  }
  return (
    <View style={{flex:1}}>
      <Text>hello from comp 1</Text>
      <Button title='click me' onPress={handlePress}/>
    </View>
  )
}
const Comp2=()=>{
  return (
    <View style={{flex:1}}>
      <Text>hello from comp 2</Text>
    </View>
  )
}


const Stack=createNativeStackNavigator()

export default function Application() {
  
    return (
      <Stack.Navigator>
        <Stack.Screen name='comp1' component={Comp1}/>
        <Stack.Screen name='comp2' component={Comp2}/>
      </Stack.Navigator>
     
    )
  
}
