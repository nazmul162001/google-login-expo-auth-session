import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";

// Required for web browser redirect
WebBrowser.maybeCompleteAuthSession();

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

export default function HomeScreen(): JSX.Element {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<GoogleUserInfo | null>(null);
  console.log(userInfo, "get-user-info");
  const [request, response, promptAsync] = Google.useAuthRequest({
    // @ts-ignore
    expoClientId:
      "722035899076-k3besee06cdk5ns6pv8i84u5bhvvj6kp.apps.googleusercontent.com",
    androidClientId:
      "722035899076-tseqr666gfn51m27heh05fkagis3viqq.apps.googleusercontent.com",
    iosClientId:
      "722035899076-cctnhad1073un9jv2cja64icpm7hbh8t.apps.googleusercontent.com",
    webClientId:
      "722035899076-k3besee06cdk5ns6pv8i84u5bhvvj6kp.apps.googleusercontent.com",
    responseType: "token",
    scopes: ["profile", "email"],
  });

  useEffect(() => {
    if (response?.type === "success") {
      setAccessToken(response.authentication?.accessToken || null);
      getUserData(response.authentication?.accessToken);
    } else if (response?.type === "error") {
      console.error("Authentication error:", response.error);
    }
  }, [response]);

  const getUserData = async (token: string | undefined) => {
    if (!token) return;

    try {
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await userInfoResponse.json();
      setUserInfo(data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const handleSignIn = async () => {
    try {
      const result = await promptAsync();
      if (result.type !== "success") {
        console.log("Sign in was canceled or failed");
      }
    } catch (error) {
      console.error("Error during sign in:", error);
    }
  };

  const handleSignOut = () => {
    setAccessToken(null);
    setUserInfo(null);
  };

  return (
    <View style={styles.container}>
      {!userInfo ? (
        <Button
          title="Sign In With Google"
          onPress={handleSignIn}
          disabled={!request}
        />
      ) : (
        <View style={styles.userInfoContainer}>
          <Text style={styles.welcomeText}>Welcome! {userInfo?.name}</Text>
          <Image
            source={{ uri: userInfo.picture }}
            style={styles.profilePicture}
          />
          <View style={styles.userDetails}>
            <Text style={styles.nameText}>Full Name: {userInfo.name}</Text>
            <Text style={styles.infoText}>
              First Name: {userInfo.given_name}
            </Text>
            <Text style={styles.infoText}>
              Last Name: {userInfo.family_name}
            </Text>
            <Text style={styles.infoText}>Email: {userInfo.email}</Text>
            <Text style={styles.infoText}>
              Email Verified: {userInfo.verified_email ? "Yes" : "No"}
            </Text>
            <Text style={styles.infoText}>Google ID: {userInfo.id}</Text>
          </View>
          <Button title="Sign Out" onPress={handleSignOut} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  userInfoContainer: {
    width: "100%",
    alignItems: "center",
    padding: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 15,
  },
  userDetails: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  nameText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
});
