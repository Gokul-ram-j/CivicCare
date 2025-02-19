import React from "react";
import { View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";

export default function SOSEmergencyMsg() {
  const route = useRoute();
  const { name, date, time, location } = route.params || {};

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>SOS Emergency</Text>
      <Text>Name: {name || "N/A"}</Text>
      <Text>Date: {date || "N/A"}</Text>
      <Text>Time: {time || "N/A"}</Text>
      <Text>Location: {location || "N/A"}</Text>
    </View>
  );
}
