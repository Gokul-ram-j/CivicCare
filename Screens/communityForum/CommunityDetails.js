import { useNavigation } from "@react-navigation/native";
import { Button, StyleSheet, Text, View } from "react-native";

export function CommunityDetails({route}) {
    // community details
    const {item}=route.params
    // navigation
    const navigation=useNavigation()
    console.log(item)
  return (
    <View style={styles.container}>
      <Text>hi from community Details  {item.id}</Text>
      <Button title='back' onPress={()=>navigation.navigate('CommunityList')}/>
    {item.members.map((data)=>{
        return(<Text key={data}>{data}</Text>)
    })}
    </View>
  );
}

const styles=StyleSheet.create({
  container:{
    width:'100%',
    height:'100%'
  }
})

export default CommunityDetails;
