import {
  View,
  Text,
  ActivityIndicator,
  Image,
  StyleSheet,
  Share,
  ScrollView,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  router,
  Stack,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { useEvent } from "@/api/events";
import { SafeAreaView } from "react-native-safe-area-context";
import { host, url } from "@/constants";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useScrollViewOffset,
  useSharedValue,
} from "react-native-reanimated";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  AntDesign,
  EvilIcons,
  Ionicons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { getUser } from "@/api/user";
import MapView, { Marker } from "react-native-maps";
import { useUser } from "@clerk/clerk-expo";
import useUserStore from "@/store/userStore";
import axios from "axios";
import { getDateString, getTime } from "@/lib/utils";

const EventPage = () => {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useSharedValue(0);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [dateString, setDateString] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const {
    user: currentUser,
    removeFavoriteEvent,
    addFavoriteEvent,
  } = useUserStore();
  const [isFav, setIsFav] = useState<boolean>(false);

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

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollOffset.value = event.contentOffset.y;
  });

  const { id: idString } = useLocalSearchParams();
  const id = typeof idString === "string" ? idString : idString![0];
  const { data: event, isLoading, error } = useEvent(id);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-450, 0, 450],
            [-450 / 2, 0, 450 * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-450, 0, 450], [2, 1, 0.75]),
        },
      ],
    };
  });

  useEffect(() => {
    if (currentUser && currentUser.favorite_events) {
      setLoading(true);
      let isFavorite = false;
      if (currentUser.favorite_events) {
        isFavorite =
          currentUser.favorite_events &&
          event &&
          currentUser.favorite_events?.some(
            (favEvent) => favEvent._id?.toString() === event._id.toString()
          );
      }
      setIsFav(isFavorite || false);
      setLoading(false);
    }
  }, [currentUser, event]);

  const shareEvent = async () => {
    try {
      Share.share({
        title: event.title,
        message: event.description,
      });
    } catch (error: any) {
      alert(error.message);
    }
  };

  useEffect(() => {
    if (event) {
      setDateString(getDateString(event.dateField.toString()));
      setTime(getTime(event.dateField.toString()));
    }
  }, [event])

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Animated.ScrollView
      ref={scrollRef}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "",

          headerRight: () => (
            <View style={styles.headerView}>
              {!isFav ? (
                <TouchableOpacity
                  onPress={handleFavorite}
                  style={styles.iconStyle}
                >
                  <MaterialIcons
                    name="favorite-border"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={handleFavorite}
                  style={styles.iconStyle}
                >
                  <MaterialIcons name="favorite" size={24} color="black" />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={shareEvent} style={styles.iconStyle}>
                <AntDesign name="sharealt" size={24} color="black" />
              </TouchableOpacity>
            </View>
          ),
          headerLeft: () => (
            <View style={{ paddingVertical: 5 }}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.iconStyle}
              >
                <MaterialIcons
                  name="keyboard-arrow-left"
                  size={28}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <View>
        <Animated.Image
          source={{
            uri: url + event.banner,
          }}
          style={[styles.image, imageAnimatedStyle]}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            padding: 20,
            paddingHorizontal: 20,
            backgroundColor: "black",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 15,
              flexWrap: "wrap",
              marginTop: 12,
            }}
          >
            {event?.categories.map((category: any, index: number) => (
              <View style={styles.category} key={index}>
                <Text
                  style={{
                    color: "white",
                    fontFamily: "FontMedium",
                    fontSize: 12,
                    textTransform: "capitalize",
                  }}
                >
                  {category.name}
                </Text>
              </View>
            ))}
          </View>
          <Text
            style={{
              color: "white",
              marginTop: 15,
              fontFamily: "FontBold",
              fontSize: 28,
            }}
          >
            {event.title}
          </Text>
          <View>
            <View
              style={{
                marginTop: 25,
                flexDirection: "row",
                gap: 15,
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: event.organizer_id.profileImage }}
                width={45}
                height={45}
                resizeMode="cover"
                style={{ borderRadius: 25 }}
              />
              <View style={{ gap: 8 }}>
                <Text
                  style={{
                    color: "white",
                    fontFamily: "FontSemiBold",
                    fontSize: 16,
                  }}
                >
                  {event.organizer_id.name}
                </Text>
                <Text
                  style={{
                    color: "gray",
                    fontFamily: "FontRegular",
                    fontSize: 13,
                  }}
                >
                  Organizer
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: 30,
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
              }}
            >
              <EvilIcons name="calendar" size={24} color="gray" />
              <View style={{ gap: 6 }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontFamily: "FontSemiBold",
                  }}
                >
                  {dateString}
                </Text>
                <Text
                  style={{
                    color: "gray",
                    fontSize: 13,
                    fontFamily: "FontRegular",
                  }}
                >
                  {time} Onwards
                </Text>
              </View>
            </View>
            {!event.is_online && (
              <View
                style={{
                  marginTop: 30,
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <SimpleLineIcons name="location-pin" size={18} color="gray" />
                <View style={{ gap: 6 }}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                      fontFamily: "FontSemiBold",
                    }}
                  >
                    {event?.venueName}
                  </Text>
                  <Text
                    style={{
                      color: "gray",
                      fontSize: 13,
                      fontFamily: "FontRegular",
                    }}
                  >
                    {event?.dateField.split(",")[1]} Onwards
                  </Text>
                </View>
              </View>
            )}
            {!event.is_online && (
              <View style={{ marginTop: 25, borderRadius: 25 }}>
                <MapView
                  style={{ width: "100%", height: 150, borderRadius: 25 }}
                  initialRegion={{
                    latitude: event.venue.latitude,
                    longitude: event?.venue.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: event.venue.latitude,
                      longitude: event?.venue.longitude,
                    }}
                    onPress={(data) => console.log(data.nativeEvent.coordinate)}
                  />
                </MapView>
              </View>
            )}
            {event.is_online && (
              <View
                style={{
                  marginTop: 30,
                  flexDirection: "row",
                  gap: 10,
                  paddingLeft: 3,
                  alignItems: "center",
                }}
              >
                <Ionicons name="laptop-outline" size={18} color="#959595" />
                <View style={{ gap: 6 }}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                      fontFamily: "FontBold",
                    }}
                  >
                    Online event
                  </Text>
                </View>
              </View>
            )}
            <View style={{ marginTop: 25 }}>
              <Text
                style={{ color: "white", fontFamily: "FontBold", fontSize: 20 }}
              >
                About event
              </Text>
              <Text
                style={{
                  color: "gray",
                  marginTop: 18,
                  fontFamily: "FontMedium",
                  fontSize: 15,
                  lineHeight: 25,
                }}
              >
                {event.description}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 450,
    width: "100%",
  },
  iconStyle: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 25,
    marginLeft: 10,
  },
  headerView: {
    flexDirection: "row",
    gap: 18,
    alignItems: "center",
    paddingVertical: 10,
    // backgroundColor: "black"
  },
  category: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    paddingHorizontal: 13,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
});

export default EventPage;
