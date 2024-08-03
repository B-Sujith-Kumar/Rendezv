import {
  View,
  Text,
  ActivityIndicator,
  Image,
  StyleSheet,
  Share,
  ScrollView,
} from "react-native";
import React, { useLayoutEffect } from "react";
import {
  router,
  Stack,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { useEvent } from "@/api/events";
import { SafeAreaView } from "react-native-safe-area-context";
import { url } from "@/constants";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  AntDesign,
  EvilIcons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { getUser } from "@/api/user";
import MapView, { Marker } from "react-native-maps";

const EventPage = () => {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === "string" ? idString : idString![0]);
  const { data: event, isLoading, error } = useEvent(id);
  const { data: organizer, isLoading: organizerLoading } = getUser(
    event?.data.organizer_id
  );
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
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

  const shareEvent = async () => {
    try {
      Share.share({
        title: event?.data.title,
        message: event?.data.description,
      });
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (isLoading || organizerLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Animated.ScrollView
      ref={scrollRef}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "",

          headerRight: () => (
            <View style={styles.headerView}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.iconStyle}
              >
                <MaterialIcons name="favorite-border" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={shareEvent} style={styles.iconStyle}>
                <AntDesign name="sharealt" size={24} color="black" />
              </TouchableOpacity>
            </View>
          ),
          headerLeft: () => (
            <View style={{ paddingVertical: 15 }}>
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
            uri: url + event?.data.banner,
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
            {event?.data.title}
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
                source={{ uri: organizer.profileImage }}
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
                  {organizer.name}
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
                  {event?.data.date_time.split(",")[0]}
                </Text>
                <Text
                  style={{
                    color: "gray",
                    fontSize: 13,
                    fontFamily: "FontRegular",
                  }}
                >
                  {event?.data.date_time.split(",")[1]} Onwards
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
              <SimpleLineIcons name="location-pin" size={18} color="gray" />
              <View style={{ gap: 6 }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontFamily: "FontSemiBold",
                  }}
                >
                  {event?.data.venue_name}
                </Text>
                <Text
                  style={{
                    color: "gray",
                    fontSize: 13,
                    fontFamily: "FontRegular",
                  }}
                >
                  {event?.data.date_time.split(",")[1]} Onwards
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 25, borderRadius: 25 }}>
              <MapView
                style={{ width: "100%", height: 120, borderRadius: 25 }}
                initialRegion={{
                  latitude: event?.data.location.latitude,
                  longitude: event?.data.location.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: event?.data.location.latitude,
                    longitude: event?.data.location.longitude,
                  }}
                  onPress={(data) => console.log(data.nativeEvent.coordinate)}
                />
              </MapView>
            </View>
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
                {event?.data.description}
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
    paddingVertical: 15,
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
