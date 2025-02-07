import { View, Text, StyleSheet,ScrollView } from "react-native";

export default function UserDetailContainer({ details }) {
  console.log("from udc------------>", details);
  return (
    <View style={styles.container}>
      <View style={styles.contextWrapper}>
        <Text style={styles.labelText}>Name:</Text>
        <Text style={styles.detailText}>{details.userData?.name}</Text>
      </View>
      <View style={styles.contextWrapper}>
        <Text style={styles.labelText}>DOB:</Text>
        <Text style={styles.detailText}>{details.userData?.dob}</Text>
      </View>
      <View style={styles.contextWrapper}>
        <Text style={styles.labelText}>Gender:</Text>
        <Text style={styles.detailText}>{details.userData?.gender}</Text>
      </View>
      <View style={styles.contextWrapper}>
        <Text style={styles.labelText}>Address:</Text>
        <ScrollView
          style={styles.scrollContainer}
          nestedScrollEnabled
          contentContainerStyle={styles.contentContainer}
        >
          <Text style={styles.detailText}>{details.userData?.address}</Text>
        </ScrollView>
      </View>
      <View style={styles.contextWrapper}>
        <Text style={styles.labelText}>Profession:</Text>
        <Text style={styles.detailText}>{details.userData?.profession}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    marginHorizontal: "auto",
    height: "70%",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
  },
  contextWrapper: {
    flexDirection: "row",
    width: "100%",
    marginHorizontal: "auto",
    marginVertical: "4",
  },
  scrollContainer: {
    maxHeight: 80, // Restrict height to 30
  },
  contentContainer: {
    flexGrow: 1, // Allows content to scroll if it's larger
  },
  labelText: {
    width: "40%",
  },
  detailText: {
    width: "60%",
    fontWeight: "bold",
  },
});
