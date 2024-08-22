import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { IEvent } from "@/types";

const EventItem = ({ event }: { event: any }) => {

  return (
    <View style={styles.container}>
      <View>
        <Image
          source={{ uri: event.banner }}
          width={80}
          height={80}
          resizeMode="cover"
          style={styles.banner}
        />
        <View
          style={{
            backgroundColor: "white",
            position: "absolute",
            paddingHorizontal: 15,
            top: 13,
            right: "4%",
            borderRadius: 25,
            paddingVertical: 8,
          }}
        >
          <Text
            style={{
              color: "black",
              backgroundColor: "white",
              fontFamily: "FontSemiBold",
            }}
          >
            {event.category}
          </Text>
        </View>
      </View>
      <View style={{ marginTop: 25, paddingHorizontal: 14 }}>
        <Text
          style={{
            textTransform: "uppercase",
            color: "#f8eb6b",
            fontFamily: "FontSemiBold",
            letterSpacing: 0.7,
          }}
        >
          {event.day}, {event.date}
        </Text>
        <View
          style={{
            flexDirection: "row",
            marginTop: 5,
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Text
            style={{
              color: "white",
              fontFamily: "FontBold",
              fontSize: 25,
            }}
          >
            {event.title}
          </Text>
          <TouchableOpacity>
            <MaterialIcons
              name="favorite-border"
              size={24}
              color="#dfdfdf"
              style={{
                borderWidth: 1.5,
                borderColor: "#3c3c3c",
                padding: 10,
                borderRadius: 13,
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginTop: 10,
            paddingBottom: 10,
            alignItems: "center",
            gap: 4,
          }}
        >
          <SimpleLineIcons name="location-pin" size={18} color="#959595" />
          <Text
            style={{
              color: "#959595",
              fontFamily: "FontRegular",
            }}
          >
            {event.location}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#212121",
    marginTop: 20,
    borderRadius: 25,
    padding: 12,
    borderWidth: 0.9,
    borderColor: "#3a3a3a",
  },
  banner: {
    width: null,
    height: 180,
    resizeMode: "cover",
    borderRadius: 25,
    borderWidth: 0.9,
    borderColor: "#3a3a3a",
  },
});

export default EventItem;
