import React, { Component } from "react";
import { Image, SafeAreaView, Text, View, StyleSheet,Dimensions } from "react-native";

const { width } = Dimensions.get("window"); // Get device width for full-width image
export function NotFound() {

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("../../assets/notFound.png")}
          style={styles.image}
        />
        <Text style={styles.text}>No Community Found</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "start",
  },
  content: {
    alignItems: "center",
  },
  image: {
    width: width - 80, // Full width with slight margin
    height: width - 80, // Square size
    resizeMode: "contain",
  },
  text: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});

export default NotFound;
