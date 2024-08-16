import { View, Text, Image, Dimensions } from "react-native";
import React from "react";
import { url } from "@/constants";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons, MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";

const EventListItem = ({ event }: { event: any }) => {
  if (event.is_online) {
    return;
  }

  return (
    <View
      style={{
        width: Dimensions.get("screen").width * 0.7,
        backgroundColor: "#212121",
        borderRadius: 15,
        margin: 5,
        padding: 10,
        borderWidth: 0.9,
        borderColor: "#3a3a3a",
      }}
    >
      <Image
        source={{ uri: url + event.banner }}
        style={{
          width: "100%",
          height: 130,
          borderRadius: 15,
          borderWidth: 0.9,
          borderColor: "#3a3a3a",
        }}
        resizeMode="cover"
      />
      <View style={{ paddingLeft: 5 }}>
        <Text
          style={{
            textTransform: "uppercase",
            color: "#f8eb6b",
            fontFamily: "FontSemiBold",
            marginTop: 10,
            fontSize: 12,
          }}
        >
          {event.dateField}
        </Text>
        <View
          style={{
            flexDirection: "row",
            marginTop: 4,
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Text
            style={{
              color: "white",
              fontFamily: "FontBold",
              fontSize: 20,
            }}
          >
            {event.title.length <= 25
              ? event.title
              : event.title.slice(0, 19) + "..."}
          </Text>
          <TouchableOpacity>
            <MaterialIcons
              name="favorite-border"
              size={18}
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
        {event.venueName && (
            <View
              style={{
                flexDirection: "row",
                marginTop: 6,
                paddingBottom: 10,
                alignItems: "center",
                gap: 4,
              }}
            >
              <SimpleLineIcons name="location-pin" size={13} color="#959595" />
              <Text
                style={{
                  color: "#959595",
                  fontFamily: "FontRegular",
                }}
              >
                {event.venueName}
              </Text>
            </View>
          )}
      </View>
    </View>
  );
};

export default EventListItem;
