import React from "react";
import * as WebBrowser from "expo-web-browser";
import { Text, View, Button, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { Fontisto } from "@expo/vector-icons";

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

const OAuthFacebook = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_facebook" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({
          redirectUrl: Linking.createURL("/(tabs)", { scheme: "myapp" }),
        });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
      <TouchableOpacity style={styles.socialLogin} onPress={onPress}>
        <Fontisto name="facebook" size={24} color="white" />
        <Text style={{ color: "white", fontSize: 18, fontFamily: "FontBold" }}>
          Continue with Facebook
        </Text>
      </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  socialLogin: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginVertical: 10,
    paddingVertical: 22,
    borderColor: "#313131",
    borderWidth: 1,
    width: "100%",
    borderRadius: 15,
  },
});
export default OAuthFacebook;
