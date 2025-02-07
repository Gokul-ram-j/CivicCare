import { View, ActivityIndicator, Text } from "react-native";

const Loader = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" />
      <Text
        style={{
          marginTop: 10,
          fontSize: 16,
          fontWeight: "bold",
        }}
      >
        Hold tight! We're logging you in... 🚀
      </Text>
    </View>
  );
};

export default Loader;
