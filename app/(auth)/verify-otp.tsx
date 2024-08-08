import {
  View,
  Text,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useRef } from "react";
import { router, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import OTPTextView from "react-native-otp-textinput";
import { useSignUp } from "@clerk/clerk-expo";
import { supabase } from "@/lib/supabase";
import axios from "axios";
import { host } from "@/constants";

const VerifyOTP = () => {
  let otpInput = useRef(null);
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = React.useState("");
  const clearText = () => {
    otpInput.current.clear();
  };

  const setText = () => {
    otpInput.current.setValue("1234");
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        const res = await fetch(`${host}/users/create-user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: signUp.emailAddress,
            name: signUp.firstName
          }),
        });
        router.replace("/(tabs)");
      } else {
        return Alert.alert(
          "Error",
          "We couldn't verify your email address. Please try again."
        );
      }
    } catch (err: any) {
      return Alert.alert(
        "Error",
        "Invalid verification code. Please try again."
      );
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView>
        <View style={styles.container}>
          <Text style={styles.title}>Enter verification code</Text>
          <Text
            style={{
              color: "gray",
              marginTop: 10,
              fontFamily: "FontRegular",
              lineHeight: 23,
            }}
          >
            We've sent a verification code to your email address. Please enter
            it below
          </Text>
          <View style={{ marginTop: 40 }}>
            <OTPTextView
              ref={(e) => (otpInput = e)}
              textInputStyle={{
                width: 55,
                height: 55,
                borderRadius: 10,
                borderColor: "gray",
                borderWidth: 1,
                borderBottomWidth: 0.9,
                backgroundColor: "#1f1f1f",
                color: "white",
              }}
              keyboardType="numeric"
              handleTextChange={(text) => setCode(text)}
              tintColor="#f8eb6b"
              offTintColor={"#1f1f1f"}
              inputCount={6}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={onPressVerify}>
            <Text
              style={{ color: "black", fontSize: 18, fontFamily: "FontBold" }}
            >
              Verify
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    height: "100%",
    paddingHorizontal: 20,
    width: "100%",
    color: "white",
  },
  title: {
    color: "white",
    marginTop: 70,
    fontFamily: "FontSemiBold",
    fontSize: 25,
  },
  button: {
    backgroundColor: "#f8eb6b",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 19,
    borderRadius: 15,
    marginTop: 50,
  },
});
export default VerifyOTP;
