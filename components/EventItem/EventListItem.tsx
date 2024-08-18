import {
  View,
  Text,
  Image,
  Dimensions,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { host, url } from "@/constants";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons, MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import axios from "axios";
import useUserStore from "@/store/userStore";
import { useUser } from "@clerk/clerk-expo";

const EventListItem = ({ event }: { event: any }) => {
  if (event.is_online) {
    return;
  }

  const { user } = useUser();
  const {
    user: currentUser,
    removeFavoriteEvent,
    addFavoriteEvent,
  } = useUserStore();
  const [isFav, setIsFav] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      let isFavorite = false;
      if (currentUser.favorite_events) {
        isFavorite = currentUser.favorite_events?.some(
          (favEvent) => favEvent._id.toString() === event._id.toString()
        );
      }
      setIsFav(isFavorite || false);
      setLoading(false);
    }
  }, [currentUser, event]);

  const handleFavorite = async () => {
    try {
      const res = await axios.post(`${host}/users/add-favorite`, {
        eventId: event._id.toString(),
        email: user?.emailAddresses[0].emailAddress,
      });
      if (res.data.success) {
        if (res.data.removed) {
          removeFavoriteEvent(event._id.toString());
          setIsFav(false);
        } else {
          addFavoriteEvent(event);
          setIsFav(true);
        }
      }
    } catch (error) {
      console.log("API error:", error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <Link href={`/(events)/event/${event._id.toString()}`} asChild>
      <Pressable
        style={{
          width: Dimensions.get("screen").width * 0.9,
          backgroundColor: "#212121",
          marginHorizontal: 8,
          marginLeft: 10,
          borderRadius: 15,
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
              {event.title.length <= 26
                ? event.title
                : event.title.slice(0, 26) + "..."}
            </Text>
            {!isFav ? (
              <TouchableOpacity onPress={handleFavorite}>
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
            ) : (
              <TouchableOpacity onPress={handleFavorite}>
                <MaterialIcons
                  name="favorite"
                  size={18}
                  color="red"
                  style={{
                    borderWidth: 1.5,
                    borderColor: "#3c3c3c",
                    padding: 10,
                    borderRadius: 13,
                  }}
                />
              </TouchableOpacity>
            )}
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
      </Pressable>
    </Link>
  );
};

export default EventListItem;
