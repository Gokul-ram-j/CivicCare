import {
  Button,
  Image,
  StyleSheet,
  Text,
  View,
  Animated,
  useWindowDimensions,
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import slides from "./slides";
import { FlatList } from "react-native";
import OnboardingItems from "./OnboardingItems";
import { useRef, useState } from "react";
import Paginator from "./Paginator";
export default function OnboardScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  const { width } = useWindowDimensions();
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0 && viewableItems[0]?.index !== undefined) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <View style={{ flex: 3, justifyContent: "center", alignItems: "center" }}>
      <FlatList
        data={slides}
        renderItem={({ item }) => {
          return <OnboardingItems item={item} />;
        }}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator
        pagingEnabled
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        style={{ width }}
        scrollEventThrottle={32}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />

      <Paginator data={slides} scrollX={scrollX} />
       <View style={[styles.btnContainer,{width}]}>
        <Button
          title="Explore"
          style={styles.button}
          onPress={() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "AppTabs", params: { screen: "Home" } }],
              })
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginBottom: 15,
    width:'80%'
  },
  btnContainer:{
    padding:10
  }
});
