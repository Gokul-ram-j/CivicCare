import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Text,
} from "react-native";
import ImageViewing from "react-native-image-viewing";
import { AntDesign } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";

const AttachmentsImgs = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { uris } = route.params || { uris: [] }; // Get uris from route params
  const [visible, setVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openImage = (index) => {
    setSelectedIndex(index);
    setVisible(true);
  };

  return (
    <View style={styles.screen}>
      {/* Fixed Header for Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={30} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Conditional Rendering: Show message if uris is empty */}
      {uris.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Attachments Available</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          {uris.map((uri, index) => (
            <TouchableOpacity key={index} onPress={() => openImage(index)}>
              <Image source={{ uri }} style={styles.image} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Full-screen image viewer */}
      <Modal visible={visible} transparent={true} animationType="fade">
        <ImageViewing
          images={uris.map((uri) => ({ uri }))}
          imageIndex={selectedIndex}
          visible={visible}
          onRequestClose={() => setVisible(false)}
          swipeToCloseEnabled
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 20, // Ensure it's above images
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Light background for visibility
    padding: 8,
    borderRadius: 50,
  },
  container: {
    paddingTop: 60, // Push images down to avoid overlap with back button
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
  },
});

export default AttachmentsImgs;
