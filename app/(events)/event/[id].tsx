import {
  View,
  Text,
  ActivityIndicator,
  Image,
  StyleSheet,
  Share,
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

const EventPage = () => {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === "string" ? idString : idString![0]);
  const { data: event, isLoading, error } = useEvent(id);
  const navigation = useNavigation();

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
        title: event.name,
        message: event.description,
      });
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
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
            uri: url + event.banner,
          }}
          style={[styles.image, imageAnimatedStyle]}
        />
      </View>
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
});

export default EventPage;
