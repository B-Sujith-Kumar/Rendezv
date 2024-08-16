// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   Pressable,
// } from "react-native";
// import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
// import { SimpleLineIcons } from "@expo/vector-icons";
// import { host, url } from "@/constants";
// import { Link } from "expo-router";
// import axios from "axios";
// import { useUser } from "@clerk/clerk-expo";
// import useUserStore from "@/store/userStore";

// const HorizontalEventCard = ({ event }: { event: any }) => {
//   const { user } = useUser();
//   const { user: currentUser } = useUserStore();
//   const [isFav, setIsFav] = useState<boolean>(false);
//   const { removeFavoriteEvent, addFavoriteEvent } = useUserStore();

//   useEffect(() => {
//     if (currentUser) {
//       const isFavorite = currentUser.favorite_events?.some(
//         (favEvent) => favEvent._id.toString() === event._id.toString()
//       );
//       setIsFav(isFavorite || false);
//     }
//   }, [currentUser, event._id, isFav]);

//   const handleFavorite = async () => {
//     try {
//       const res = await axios.post(`${host}/users/add-favorite`, {
//         eventId: event._id.toString(),
//         email: user?.emailAddresses[0].emailAddress,
//       });
//       console.log(res.data.removed);
//       if (res.data.success) {
//         if (res.data.removed) {
//           removeFavoriteEvent(event._id.toString());
//           setIsFav(false);
//         } else {
//           addFavoriteEvent(event);
//           setIsFav(true);
//         }
//       }
//       console.log(useUserStore.getState().user);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <Link href={`/(events)/event/${event._id.toString()}`} asChild>
//       <Pressable style={styles.container}>
//         <View>
//           <Image
//             source={{ uri: url + event.banner }}
//             width={80}
//             height={80}
//             resizeMode="cover"
//             style={styles.banner}
//           />
//           <View
//             style={{
//               backgroundColor: "white",
//               position: "absolute",
//               paddingHorizontal: 15,
//               top: 13,
//               right: "4%",
//               borderRadius: 25,
//               paddingVertical: 8,
//             }}
//           >
//             <Text
//               style={{
//                 color: "black",
//                 backgroundColor: "white",
//                 fontFamily: "FontSemiBold",
//                 textTransform: "capitalize",
//               }}
//             >
//               {event.categories[0].name}
//             </Text>
//           </View>
//         </View>
//         <View style={{ marginTop: 25, paddingHorizontal: 14 }}>
//           <Text
//             style={{
//               textTransform: "uppercase",
//               color: "#f8eb6b",
//               fontFamily: "FontSemiBold",
//               letterSpacing: 0.7,
//             }}
//           >
//             {event.dateField}
//           </Text>
//           <View
//             style={{
//               flexDirection: "row",
//               marginTop: 5,
//               justifyContent: "space-between",
//               alignItems: "center",
//               gap: 10,
//             }}
//           >
//             <Text
//               style={{
//                 color: "white",
//                 fontFamily: "FontBold",
//                 fontSize: 25,
//               }}
//             >
//               {event.title.length <= 18
//                 ? event.title
//                 : event.title.slice(0, 15) + "..."}
//             </Text>
//             <TouchableOpacity onPress={handleFavorite}>
//               {isFav ? (
//                 <AntDesign
//                   name="heart"
//                   size={20}
//                   color="red"
//                   style={{
//                     borderWidth: 1.5,
//                     borderColor: "#3c3c3c",
//                     padding: 10,
//                     borderRadius: 13,
//                   }}
//                 />
//               ) : (
//                 <MaterialIcons
//                   name="favorite-border"
//                   size={24}
//                   color="#dfdfdf"
//                   style={{
//                     borderWidth: 1.5,
//                     borderColor: "#3c3c3c",
//                     padding: 10,
//                     borderRadius: 13,
//                   }}
//                 />
//               )}
//             </TouchableOpacity>
//           </View>
//           {event.venueName && (
//             <View
//               style={{
//                 flexDirection: "row",
//                 marginTop: 10,
//                 paddingBottom: 10,
//                 alignItems: "center",
//                 gap: 4,
//               }}
//             >
//               <SimpleLineIcons name="location-pin" size={18} color="#959595" />
//               <Text
//                 style={{
//                   color: "#959595",
//                   fontFamily: "FontRegular",
//                 }}
//               >
//                 {event.venueName}
//               </Text>
//             </View>
//           )}
//           {!event.venueName && (
//             <View
//               style={{
//                 flexDirection: "row",
//                 marginTop: 10,
//                 paddingBottom: 10,
//                 alignItems: "center",
//                 gap: 4,
//               }}
//             >
//               <Ionicons name="laptop-outline" size={18} color="#959595" />
//               <Text
//                 style={{
//                   color: "#959595",
//                   fontFamily: "FontRegular",
//                 }}
//               >
//                 Online event
//               </Text>
//             </View>
//           )}
//         </View>
//       </Pressable>
//     </Link>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "#212121",
//     marginTop: 20,
//     borderRadius: 25,
//     padding: 12,
//     borderWidth: 0.9,
//     borderColor: "#3a3a3a",
//     width: 340,
//   },
//   banner: {
//     width: null,
//     height: 180,
//     resizeMode: "cover",
//     borderRadius: 25,
//     borderWidth: 0.9,
//     borderColor: "#3a3a3a",
//   },
// });

// export default HorizontalEventCard;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { host, url } from "@/constants";
import { Link } from "expo-router";
import axios from "axios";
import { useUser } from "@clerk/clerk-expo";
import useUserStore from "@/store/userStore";

const HorizontalEventCard = ({ event }: { event: any }) => {
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
      console.log("API response:", res.data);
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
              {event.categories[0].name}
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
            {event.dateField}
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
              {event.title.length <= 18
                ? event.title
                : event.title.slice(0, 15) + "..."}
            </Text>
            <TouchableOpacity onPress={handleFavorite}>
              {isFav ? (
                <MaterialIcons
                  name="favorite"
                  size={24}
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
                  size={24}
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
    width: 340,
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

export default HorizontalEventCard;
