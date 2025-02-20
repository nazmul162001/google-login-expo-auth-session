import * as Facebook from "expo-auth-session/providers/facebook";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Register your app for web browser redirects
WebBrowser.maybeCompleteAuthSession();

const FacebookLogin = () => {
  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: "1793342164818323",
    // Make sure this matches your app's configuration
    redirectUri: "com.nazmul1140.googlelogin://redirect",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.authentication;
      console.log("Facebook Access Token:", access_token);
      fetchUserInfo(access_token);
    } else if (response) {
      console.log("Auth response:", response);
    }
  }, [response]);

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch(
        `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`
      );
      const userInfo = await response.json();
      console.log("User Info:", userInfo);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, !request && styles.disabledButton]}
        onPress={() => promptAsync()}
        disabled={!request}
      >
        <Text style={styles.buttonText}>Sign In With Facebook</Text>
      </TouchableOpacity>
    </View>
  );
};

// Your styles remain the same...

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: 250,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#1877F2",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
});

export default FacebookLogin;
