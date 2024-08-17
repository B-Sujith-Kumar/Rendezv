import { ScrollView, StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { Link, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import useUserStore from "@/store/userStore";
import { FontAwesome } from "@expo/vector-icons";

export default function TabTwoScreen() {
  const { city } = useUserStore();
  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <ScrollView>
        <Stack.Screen
          options={{
            title: "Explore",
            headerTransparent: true,
            headerTitleStyle: {
              fontWeight: "bold",
              fontFamily: "FontBold",
              fontSize: 19,
            },
          }}
        />
        <View style={{ marginTop: 50, paddingHorizontal: 20 }}>
          <View style={styles.title}>
            <Text style={{ fontSize: 19, fontFamily: "FontSemiBold" }}>
              Find events near{" "}
            </Text>
            <Link href="" style={{flexDirection: "row", alignItems: "flex-end"}}>
              <Text
                style={{
                  color: "cyan",
                  fontSize: 19,
                  fontFamily: "FontSemiBold",
                }}
              >
                {" "}
                {city}
                {"  "}
              </Text>
              <FontAwesome name="pencil-square-o" size={15} color="cyan" />
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
