import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const UserDropdown = ({ userData, profileURL }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <View style={styles.container}>
      {/* Username with Arrow */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.8}
      >
        <Ionicons
          name={isOpen ? "chevron-down" : "chevron-forward"}
          size={20}
          color="#007AFF"
          style={styles.icon}
        />
        <View style={styles.imageContainer}>
          <Image source={{ uri: profileURL }} style={styles.image} resizeMode="cover" />
        </View>
        <Text style={styles.username}>{userData?.name}</Text>
      </TouchableOpacity>

      {/* Dropdown Content */}
      {isOpen && (
        <View style={styles.dropdown}>
          <Text style={styles.info}>
            <Text style={styles.label}>📍 Address:</Text> {userData?.address}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>🎂 DOB:</Text> {userData?.dob}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>⚧ Gender:</Text> {userData?.gender}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>💼 Profession:</Text> {userData?.profession}
          </Text>
        </View>
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    width: "95%",
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#F0F8FF",
  },
  imageContainer: {
    height: 30,
    width: 30,
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#007AFF",
    marginHorizontal: 5,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  username: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    color: "#333",
  },
  icon: {
    marginRight: 5,
  },
  dropdown: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 4,
    overflow: "hidden",
  },
  info: {
    fontSize: 13,
    marginBottom: 3,
    color: "#555",
  },
  label: {
    fontWeight: "bold",
    color: "#007AFF",
  },
  noMembersContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  noMembersText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
});

// MembersInfo Component
export default function MembersInfo({ memberDetail }) {
  return (
    <>
      {memberDetail.length === 0 ? (
        <View style={styles.noMembersContainer}>
          <Text style={styles.noMembersText}>No Members Found</Text>
        </View>
      ) : (
        memberDetail.map((info, ind) => (
          <UserDropdown key={ind} userData={info.userData} profileURL={info.userProfile} />
        ))
      )}
    </>
  );
}
