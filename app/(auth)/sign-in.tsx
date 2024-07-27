import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React from "react";
import { Link, Redirect, router, Stack } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import OAuthGoogle from "@/components/auth/OAuthGoogle";
import OAuthFacebook from "@/components/auth/OAuthFacebook";
import { SignedIn, SignedOut, useSignIn } from "@clerk/clerk-expo";

const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) {
      return;
    }
    if (!emailAddress.trim() || !password.trim()) {
      return Alert.alert("Error", "Please fill in all fields.");
    }
    setLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(tabs)");
      } else {
        Alert.alert(
          "Error",
          "Sorry, we couldn't sign you in. Please try again."
        );
      }
    } catch (err: any) {
      Alert.alert("Error", err.errors[0].message);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, emailAddress, password]);
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SignedIn>
        <Redirect href="/(tabs)" />
      </SignedIn>
      <SignedOut>
        <View style={styles.container}>
          <Text
            style={{ fontFamily: "FontRegular", color: "white", fontSize: 17 }}
          >
            Hey there,
          </Text>
          <Text
            style={{
              fontFamily: "FontBold",
              color: "white",
              fontSize: 32,
              marginVertical: 10,
            }}
          >
            Welcome back! 👋
          </Text>
          <View style={{ width: "100%", padding: 10, gap: 15, marginTop: 20 }}>
            <View style={styles.inputContainer}>
              <Fontisto name="email" size={16} color="#a0a0a0" />
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                placeholder="Email"
                keyboardType="email-address"
                onChangeText={setEmailAddress}
                value={emailAddress}
              />
            </View>
            <View style={styles.inputContainer}>
              <Feather name="lock" size={16} color="#a0a0a0" />
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={showPassword ? false : true}
                onChangeText={setPassword}
                value={password}
              />
              {showPassword && (
                <TouchableOpacity onPress={() => setShowPassword(false)}>
                  <FontAwesome5 name="eye" size={16} color="#a0a0a0" />
                </TouchableOpacity>
              )}
              {!showPassword && (
                <TouchableOpacity onPress={() => setShowPassword(true)}>
                  <FontAwesome5 name="eye-slash" size={16} color="#a0a0a0" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity style={styles.button} onPress={onSignInPress}>
              <Text
                style={{ color: "black", fontSize: 18, fontFamily: "FontBold" }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.seperatorContainer}>
            <View style={styles.seperator}></View>
            <Text style={{ color: "white" }}>Or</Text>
            <View style={styles.seperator}></View>
          </View>
          <OAuthGoogle />
          <OAuthFacebook />
          <View>
            <Text style={{ color: "#8d8d8d", marginTop: 20 }}>
              Don't have an account yet?{" "}
              <Link
                href="/sign-up"
                style={{ color: "white", fontFamily: "FontBold" }}
              >
                Sign Up
              </Link>
            </Text>
          </View>
        </View>
      </SignedOut>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    color: "white",
  },
  inputContainer: {
    backgroundColor: "#202020",
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    padding: 20,
    paddingHorizontal: 18,
    borderRadius: 15,
    gap: 10,
    borderColor: "#353535",
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#f8eb6b",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 19,
    borderRadius: 15,
    marginTop: 20,
  },
  seperatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginVertical: 30,
  },
  seperator: {
    height: 1,
    width: "40%",
    backgroundColor: "#8d8d8d",
  },
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

export default SignIn;
