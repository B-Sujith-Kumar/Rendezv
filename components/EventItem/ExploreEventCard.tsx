import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios, { AxiosHeaders } from 'axios';
import { host, url } from '@/constants';
import { useUser } from '@clerk/clerk-expo';
import { IEvent } from '@/types';
import useUserStore from '@/store/userStore';
import { Ionicons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Link } from 'expo-router';

const ExploreEventCard = ({event} : {event : IEvent}) => {
    const { user } = useUser();
  const {
    user: currentUser,
    removeFavoriteEvent,
    addFavoriteEvent,
  } = useUserStore();
  const [isFav, setIsFav] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      const isFavorite = currentUser.favorite_events?.some(
        (favEvent) => favEvent._id.toString() === event._id.toString()
      );
      setIsFav(isFavorite || false);
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
  return (
    <Link href={`/(events)/event/${event._id.toString()}`} asChild>
      <Pressable style={styles.container}>
        <View>
          <Image
            source={{ uri: url + event.banner }}
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
                textTransform: "capitalize",
              }}
            >
              {event.categories![0].name!}
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 18, paddingHorizontal: 14 }}>
          <Text
            style={{
              textTransform: "uppercase",
              color: "#f8eb6b",
              fontFamily: "FontSemiBold",
              letterSpacing: 0.7,
            }}
          >
            {event.dateField}
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginTop: 7,
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
              {event.title.length <= 14
                ? event.title
                : event.title.slice(0, 14) + "..."}
            </Text>
            <TouchableOpacity onPress={handleFavorite}>
              {isFav ? (
                <MaterialIcons
                  name="favorite"
                  size={20}
                  color="red"
                  style={{
                    borderWidth: 1.5,
                    borderColor: "#3c3c3c",
                    padding: 10,
                    borderRadius: 13,
                  }}
                />
              ) : (
                <MaterialIcons
                  name="favorite-border"
                  size={20}
                  color="#dfdfdf"
                  style={{
                    borderWidth: 1.5,
                    borderColor: "#3c3c3c",
                    padding: 10,
                    borderRadius: 13,
                  }}
                />
              )}
            </TouchableOpacity>
          </View>
          {event.venueName && (
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
                {event.venueName}
              </Text>
            </View>
          )}
          {!event.venueName && (
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                paddingBottom: 10,
                alignItems: "center",
                gap: 4,
              }}
            >
              <Ionicons name="laptop-outline" size={18} color="#959595" />
              <Text
                style={{
                  color: "#959595",
                  fontFamily: "FontRegular",
                }}
              >
                Online event
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    </Link>
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
    width: 270,
  },
  banner: {
    width: null,
    height: 135,
    resizeMode: "cover",
    borderRadius: 25,
    borderWidth: 0.9,
    borderColor: "#3a3a3a",
  },
});

export default ExploreEventCard

