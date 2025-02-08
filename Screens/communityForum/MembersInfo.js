import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {  useState } from "react";
import { Ionicons } from "@expo/vector-icons";
const UserDropdown = ({userData} ) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <View style={styles.container}>
      {/* Username with Arrow */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Ionicons
          name={isOpen ? "chevron-down" : "chevron-forward"}
          size={20}
          color="#000"
          style={styles.icon}
        />

        <Text style={styles.username}>{userData?.name}</Text>
      </TouchableOpacity>

      {/* Dropdown Content */}
      {isOpen && (
        <View style={styles.dropdown}>
          <Text style={styles.info}>
            <Text style={styles.label}>Address:</Text> {userData?.address}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>DOB:</Text> {userData?.dob}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Gender:</Text> {userData?.gender}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Profession:</Text> {userData?.profession}
          </Text>
        </View>
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    margin: 5,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    padding: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  icon: {
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdown: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    elevation: 3, // Adds shadow for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  info: {
    fontSize: 14,
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
  },
});

export default function MembersInfo({ memberDetail }) {
  return (
    <>
      {memberDetail.map((info,ind) => {
        return <UserDropdown key={ind} userData={info.userData} />;
      })}
    </>
  );
}
