import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const FacebookLogin = () => {
  const handleFacebookLogin = () => {
    console.log("Facebook login clicked!");
    // Implement Facebook login logic here
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleFacebookLogin}>
        <Text style={styles.buttonText}>Sign In With Facebook</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: 250, // Fixed width
    height: 50, // Fixed height
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#1877F2", // Facebook blue color
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
});

export default FacebookLogin;
