import { Text, View, StyleSheet, useWindowDimensions,Image } from "react-native";

export function OnboardingItems({ item }) {
  const {width}=useWindowDimensions();
  return (
    <View style={[styles.container]}>
      <Image  source={item.img} style={[styles.image,{width,resizeMode:'contain'}]}/>
      <View style={{flex:0.3}}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={[styles.desc,{width}]}>{item.desc}</Text>
      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image:{
    flex:0.7,
    justifyContent:'center'
  },
  title:{
    fontWeight:'bold',
    fontSize:28,
    marginBottom:10,
    textAlign:'center',
  },
  desc:{
    fontWeight:'300',
    textAlign:'center',
    paddingHorizontal:20,
  }
});

export default OnboardingItems;


  