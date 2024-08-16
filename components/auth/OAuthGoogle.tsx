import React from "react";
import * as WebBrowser from "expo-web-browser";
import { Text, View, Button, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { Fontisto } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { host } from "@/constants";
import axios from "axios";
import useUserStore from "@/store/userStore";

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

const OAuthGoogle = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { setUser } = useUserStore();

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({
          redirectUrl: Linking.createURL("/(tabs)", { scheme: "myapp" }),
        });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        const res = await fetch(`${host}/users/create-user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: signUp?.emailAddress,
            name:
              signUp?.firstName +
              (signUp?.lastName ? " " + signUp?.lastName : ""),
            clerkId: signUp?.id,
          }),
        });

        const response = await axios.post(`${host}/users/get-user`, {
          email: signUp?.emailAddress,
        });
        setUser(response.data);
      } else {
        console.error("OAuth flow was not completed");
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <TouchableOpacity style={styles.socialLogin} onPress={onPress}>
      <Fontisto name="google" size={24} color="white" />
      <Text style={{ color: "white", fontSize: 18, fontFamily: "FontBold" }}>
        Continue with Google
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
export default OAuthGoogle;
