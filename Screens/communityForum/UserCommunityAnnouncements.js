import React, { useRef } from "react";
import { ImageBackground, ScrollView } from "react-native";
import { View, Text, StyleSheet, SectionList, FlatList } from "react-native";
import { Image } from "expo-image";
// eventModalCard
const EventCard = ({ event }) => {
  // styles
  const styles = StyleSheet.create({
    card: {
      backgroundColor: "#fff",
      borderRadius: 8,
      padding: 15,
      marginVertical: 6,
      marginHorizontal: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderLeftWidth: 4,
      borderLeftColor: "#ff6b6b", // Highlight color
      width: "90%",
    },
    header: {
      backgroundColor: "#ff6b6b",
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
      alignSelf: "flex-start",
      maxWidth: "80%",
    },
    type: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "bold",
    },
    body: {
      marginTop: 5,
    },
    label: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#555",
      marginTop: 4,
    },
    value: {
      fontSize: 13,
      color: "#333",
    },
    footer: {
      marginTop: 6,
      borderTopWidth: 1,
      borderTopColor: "#ddd",
      paddingTop: 5,
    },
    meta: {
      fontSize: 11,
      color: "#777",
      textAlign: "right",
    },
  });

  return (
    <View style={styles.card}>
      <Image
        style={{
          height: 50,
          width: 50,
          position: "absolute",
          top: "5%",
          right: "5%",
        }}
        source={require("../../assets/confetti.gif")}
      />
      <View style={styles.header}>
        <Text style={styles.type}>{event.type_of_celebration}</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.label}>
          📅 {event.event_date} | ⏰ {event.event_time}
        </Text>
        <Text style={styles.label}>📍 {event.event_location}</Text>
        <Text style={styles.label}>📝 {event.desc}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.meta}>
          Posted on {event.date_of_post} at {event.time_of_post}
        </Text>
      </View>
    </View>
  );
};

// Emergency Card
const EmergencyCard = ({ emergency }) => {
  // styles
  const styles = StyleSheet.create({
    card: {
      backgroundColor: "#fff",
      borderRadius: 8,
      padding: 15,
      marginVertical: 6,
      marginHorizontal: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderLeftWidth: 4,
      borderLeftColor: "#ff6b6b", // Highlight color
      width: "90%",
    },
    header: {
      backgroundColor: "#ff6b6b",
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
      alignSelf: "flex-start",
      maxWidth: "80%",
    },
    title: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "bold",
    },
    body: {
      marginTop: 5,
    },
    label: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#555",
      marginTop: 4,
    },
    value: {
      fontSize: 13,
      color: "#333",
    },
    footer: {
      marginTop: 6,
      borderTopWidth: 1,
      borderTopColor: "#ddd",
      paddingTop: 5,
    },
    meta: {
      fontSize: 11,
      color: "#777",
      textAlign: "right",
    },
  });

  return (
    <View style={styles.card}>
      <Image
        style={{
          height: 50,
          width: 50,
          position: "absolute",
          top: "5%",
          right: "5%",
        }}
        source={require("../../assets/alarm.gif")}
      />

      <View style={styles.header}>
        <Text style={styles.title}>🚑 Emergency Request</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.label}>🏥 {emergency.hospital_name}</Text>
        <Text style={styles.label}>📍 {emergency.hospital_location}</Text>
        <Text style={styles.label}>📝 Requirements:</Text>
        <FlatList
          data={emergency.requirements}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.value}>
              {`->`} {item.medicineName} ({item.quantity})
            </Text>
          )}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.meta}>
          Posted on {emergency.date_of_post} at {emergency.time_of_post}
        </Text>
      </View>
    </View>
  );
};

// RoadConstruction
const RoadConstructionCard = ({ construction }) => {
  const styles = StyleSheet.create({
    card: {
      backgroundColor: "#fff",
      borderRadius: 8,
      padding: 15,
      marginVertical: 6,
      marginHorizontal: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderLeftWidth: 4,
      borderLeftColor: "#ff9800", // Highlight color
      width: "90%",
    },
    header: {
      backgroundColor: "#ff9800",
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
      alignSelf: "flex-start",
      maxWidth: "80%",
    },
    type: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "bold",
    },
    body: {
      marginTop: 5,
    },
    label: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#555",
      marginTop: 4,
    },
    value: {
      fontSize: 13,
      color: "#333",
    },
    footer: {
      marginTop: 6,
      borderTopWidth: 1,
      borderTopColor: "#ddd",
      paddingTop: 5,
    },
    meta: {
      fontSize: 11,
      color: "#777",
      textAlign: "right",
    },
  });

  return (
    <View style={styles.card}>
      <Image
        style={{
          height: 50,
          width: 50,
          position: "absolute",
          top: "5%",
          right: "5%",
        }}
        source={require("../../assets/under-construction.gif")}
      />
      <View style={styles.header}>
        <Text style={styles.type}>Road Block Alert 🚧</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.label}>
          🚧 Blocked Path: {construction.blocked_path}
        </Text>
        <Text style={styles.label}>
          🔄 Alternate Route: {construction.alternate_path}
        </Text>
        <Text style={styles.label}>
          ⏳ Estimated Duration: {construction.duration}
        </Text>
        <Text style={styles.label}>⚠️ Reason: {construction.reason}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.meta}>
          Posted on {construction.date_of_post} at {construction.time_of_post}
        </Text>
      </View>
    </View>
  );
};

// AccidentCard
const AccidentCard = ({ accident }) => {
  const styles = StyleSheet.create({
    card: {
      backgroundColor: "#fff",
      borderRadius: 8,
      padding: 15,
      marginVertical: 6,
      marginHorizontal: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderLeftWidth: 4,
      borderLeftColor: "#d9534f", // Red accent for emergency
      width: "90%",
    },
    header: {
      backgroundColor: "#d9534f",
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
      alignSelf: "flex-start",
      maxWidth: "80%",
    },
    type: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "bold",
    },
    body: {
      marginTop: 5,
    },
    label: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#555",
      marginTop: 4,
    },
    value: {
      fontSize: 13,
      color: "#333",
    },
    footer: {
      marginTop: 6,
      borderTopWidth: 1,
      borderTopColor: "#ddd",
      paddingTop: 5,
    },
    meta: {
      fontSize: 11,
      color: "#777",
      textAlign: "right",
    },
  });

  return (
    <View style={styles.card}>
      <Image
        style={{
          height: 50,
          width: 50,
          position: "absolute",
          top: "5%",
          right: "5%",
        }}
        source={require("../../assets/car-accident.gif")}
      />
      <View style={styles.header}>
        <Text style={styles.type}>{accident.accident_type}</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.label}>
          🏠 Place:{" "}
          <Text style={styles.value}>{accident.accident_location}</Text>
        </Text>
        <Text style={styles.label}>
          🚑 Casualties:{" "}
          <Text style={styles.value}>{accident.casualty_description}</Text>
        </Text>
        <Text style={styles.label}>🩸 Medical Needs:</Text>
        {accident.medical_requirements.map((item, index) => (
          <Text key={index} style={styles.value}>
            • {item.medicineName} - {item.quantity}
          </Text>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.meta}>
          Posted on {accident.date_of_post} at {accident.time_of_post}
        </Text>
      </View>
    </View>
  );
};

// FundRaiseAndDonation
const FundRaiseAndDonationCard = ({ donation }) => {
  const styles = StyleSheet.create({
    card: {
      backgroundColor: "#fff",
      borderRadius: 8,
      padding: 15,
      marginVertical: 6,
      marginHorizontal: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderLeftWidth: 4,
      borderLeftColor: "#28a745", // Green accent for donation
      width: "90%",
    },
    header: {
      backgroundColor: "#28a745",
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
      alignSelf: "flex-start",
      maxWidth: "80%",
    },
    type: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "bold",
    },
    body: {
      marginTop: 5,
    },
    label: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#555",
      marginTop: 4,
    },
    value: {
      fontSize: 13,
      color: "#333",
    },
    footer: {
      marginTop: 6,
      borderTopWidth: 1,
      borderTopColor: "#ddd",
      paddingTop: 5,
    },
    meta: {
      fontSize: 11,
      color: "#777",
      textAlign: "right",
    },
  });

  return (
    <View style={styles.card}>
      <Image
        style={{
          height: 50,
          width: 50,
          position: "absolute",
          top: "5%",
          right: "5%",
        }}
        source={require("../../assets/donate.gif")}
      />
      <View style={styles.header}>
        <Text style={styles.type}>{donation.category}</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.label}>
          🏢 Organization:{" "}
          <Text style={styles.value}>{donation.organisation_name}</Text>
        </Text>
        <Text style={styles.label}>
          📝 Description:{" "}
          <Text style={styles.value}>{donation.description}</Text>
        </Text>
        <Text style={styles.label}>
          💳 UPI Details:{" "}
          <Text style={styles.value}>{donation.upi_details}</Text>
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.meta}>
          Posted on {donation.date_of_post} at {donation.time_of_post}
        </Text>
      </View>
    </View>
  );
};

// AchievementCard
const AchievementCard = ({ achievement }) => {
  const styles = StyleSheet.create({
    card: {
      backgroundColor: "#fff",
      borderRadius: 8,
      padding: 15,
      marginVertical: 6,
      marginHorizontal: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderLeftWidth: 4,
      borderLeftColor: "#f39c12", // Orange accent for achievement
      width: "90%",
    },
    header: {
      backgroundColor: "#f39c12",
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
      alignSelf: "flex-start",
      maxWidth: "80%",
    },
    type: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "bold",
    },
    body: {
      marginTop: 5,
    },
    label: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#555",
      marginTop: 4,
    },
    value: {
      fontSize: 13,
      color: "#333",
    },
    footer: {
      marginTop: 6,
      borderTopWidth: 1,
      borderTopColor: "#ddd",
      paddingTop: 5,
    },
    meta: {
      fontSize: 11,
      color: "#777",
      textAlign: "right",
    },
  });

  return (
    <View style={styles.card}>
      <Image
        style={{
          height: 50,
          width: 50,
          position: "absolute",
          top: "5%",
          right: "5%",
        }}
        source={require("../../assets/trophy.gif")}
      />
      <View style={styles.header}>
        <Text style={styles.type}>{achievement.event_type} Achievement</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.label}>
          🏆 Position: <Text style={styles.value}>{achievement.position}</Text>
        </Text>
        <Text style={styles.label}>
          📜 Description:{" "}
          <Text style={styles.value}>
            {achievement.achievement_description}
          </Text>
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.meta}>
          Posted on {achievement.date_of_post} at {achievement.time_of_post}
        </Text>
      </View>
    </View>
  );
};

/// Grouping events by `date_of_post`
const groupEventsByDate = (events) => {
  const groupedData = events.reduce((acc, event) => {
    const date = event.date_of_post;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {});

  return Object.keys(groupedData)
    .sort((a, b) => new Date(b) - new Date(a)) // Sort dates in descending order
    .map((date) => ({
      title: date,
      data: groupedData[date],
    }));
};

export default function UserCommunityAnnouncements({ announcements }) {
  const sections = groupEventsByDate(announcements);

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          switch (item.category) {
            case "Events":
              return <EventCard event={item} />;
            case "Emergency":
              return <EmergencyCard emergency={item} />;
            case "Construction":
              return <RoadConstructionCard construction={item} />;
            case "Accident":
              return <AccidentCard accident={item} />;
            case "donation":
            case "fundraise":
              return <FundRaiseAndDonationCard donation={item} />;
            case "Achievement":
              return <AchievementCard achievement={item} />;
            default:
              return null; // Handle unknown category gracefully
          }
        }}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.header}>
            <Text style={styles.headerText}>{title}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 10,
    backgroundColor: "transparent",
    borderColor: "#2196F3",
  },
  header: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    marginHorizontal: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
