// import { View, Text, TextInput, StyleSheet, FlatList } from "react-native";
// import React from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Entypo, Feather, SimpleLineIcons } from "@expo/vector-icons";
// import useEventStore from "@/store/eventStore";
// import useUserStore from "@/store/userStore";
// import { router } from "expo-router";

// const FilterHeader = () => {
//   const arr = ["Sort", "Date", "Category", "Venue type", "Paid"];
//   const { city } = useUserStore();
//   return (
//     <SafeAreaView
//       edges={["top"]}
//       style={{ backgroundColor: "black", paddingBottom: 8 }}
//     >
//       <View style={styles.container}>
//         <Entypo
//           name="chevron-left"
//           size={28}
//           color="#a0a0a0"
//           onPress={() => router.back()}
//         />
//         <View style={{ flex: 1 }}>
//           <View style={styles.searchContainer}>
//             <Feather name="search" size={20} color="#a0a0a0" />
//             <TextInput
//               placeholder="Search events..."
//               style={{
//                 color: "white",
//                 fontFamily: "FontSemiBold",
//                 fontSize: 16,
//               }}
//             />
//           </View>
//         </View>
//       </View>
//       <FlatList
//         data={arr}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         style={{ marginTop: 10, marginHorizontal: 15 }}
//         keyExtractor={(item) => item}
//         renderItem={({ item }) => (
//           <View
//             style={{
//               flexDirection: "row",
//               gap: 10,
//               alignItems: "center",
//               marginHorizontal: 6,
//               backgroundColor: "#212121",
//               padding: 8,
//               paddingHorizontal: 12,
//               borderRadius: 25,
//             }}
//           >
//             <Text style={{ color: "#a0a0a0", fontFamily: "FontSemiBold" }}>
//               {item}
//             </Text>
//             <SimpleLineIcons name="arrow-down" size={12} color="#a0a0a0" />
//           </View>
//         )}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     gap: 10,
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     backgroundColor: "black",
//     alignItems: "center",
//   },
//   searchContainer: {
//     flexDirection: "row",
//     gap: 15,
//     width: "100%",
//     backgroundColor: "#212121",
//     padding: 8,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#343434",
//   },
// });

// export default FilterHeader;

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo, Feather, SimpleLineIcons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import useUserStore from "@/store/userStore";
import { router } from "expo-router";

type FilterProps = {
  openBottomSheet: (type: string) => void;
  bottomSheetRef: React.RefObject<BottomSheet>;
  snapPoints: string[];
  selectedFilter: string;
  handleOptionSelect: (option: string) => void;
  options: string[];
};

const FilterHeader = ({
  openBottomSheet,
  bottomSheetRef,
  snapPoints,
  selectedFilter,
  handleOptionSelect,
  options,
}: FilterProps) => {
  const arr = ["Sort", "Date", "Category", "Venue type", "Ticket type"];
  const { city } = useUserStore();

  return (
    <SafeAreaView
      edges={["top"]}
      style={{ backgroundColor: "black", paddingBottom: 8 }}
    >
      <View style={styles.container}>
        <Entypo
          name="chevron-left"
          size={28}
          color="#a0a0a0"
          onPress={() => router.back()}
        />
        <View style={{ flex: 1 }}>
          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color="#a0a0a0" />
            <TextInput
              placeholder="Search events..."
              placeholderTextColor="#a0a0a0"
              style={{
                color: "white",
                fontFamily: "FontSemiBold",
                fontSize: 16,
              }}
            />
          </View>
        </View>
      </View>
      <FlatList
        data={arr}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 10, marginHorizontal: 15 }}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openBottomSheet(item)}>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                marginHorizontal: 6,
                backgroundColor: "#212121",
                padding: 8,
                paddingHorizontal: 12,
                borderRadius: 25,
              }}
            >
              <Text style={{ color: "#a0a0a0", fontFamily: "FontSemiBold" }}>
                {item}
              </Text>
              <SimpleLineIcons name="arrow-down" size={12} color="#a0a0a0" />
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "black",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    gap: 15,
    width: "100%",
    backgroundColor: "#212121",
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#343434",
  },
});

export default FilterHeader;
