import FacebookLogin from "@/components/facebook/FacebookLogin";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  const [userInfo, setUserInfo] = useState<GoogleUserInfo | null>(null);

  // ✅ Use different redirect URIs for web and mobile
  const redirectUri = AuthSession.makeRedirectUri({
    // @ts-ignore
    useProxy: false, // ✅ Use `false` for native apps
  });
  console.log("Current Redirect URI:", redirectUri);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "722035899076-tseqr666gfn51m27heh05fkagis3viqq.apps.googleusercontent.com",
    iosClientId:
      "722035899076-cctnhad1073un9jv2cja64icpm7hbh8t.apps.googleusercontent.com",
    webClientId:
      "722035899076-k3besee06cdk5ns6pv8i84u5bhvvj6kp.apps.googleusercontent.com",
    responseType: "code", // ✅ Use `code` instead of `token`
    scopes: ["profile", "email"],
    redirectUri: redirectUri, // ✅ Use correct redirect URI
  });

  useEffect(() => {
    handleSignInResponse();
  }, [response]);

  const handleSignInResponse = async () => {
    if (response?.type === "success") {
      console.log("Auth Response:", response);
      const token = response.authentication?.accessToken;
      await getUserData(token);
    } else if (response?.type === "error") {
      console.error("Authentication error:", response.error);
    }
  };

  const getUserData = async (token: string | undefined) => {
    if (!token) return;

    try {
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!userInfoResponse.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData: GoogleUserInfo = await userInfoResponse.json();
      setUserInfo(userData);
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
    setUserInfo(null);
  };

  return (
    <View style={styles.container}>
      {!userInfo ? (
        <>
          <View style={styles.facebookContainer}>
            <TouchableOpacity
              style={[styles.button, !request && styles.disabledButton]}
              onPress={handleSignIn}
              disabled={!request}
            >
              <Text style={styles.buttonText}>Sign In With Google</Text>
            </TouchableOpacity>
          </View>
          <FacebookLogin />
        </>
      ) : (
        <View style={styles.userInfoContainer}>
          <Text style={styles.welcomeText}>Welcome! {userInfo?.name}</Text>
          {userInfo.picture && (
            <Image
              source={{ uri: userInfo.picture }}
              style={styles.profilePicture}
            />
          )}
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

  facebookContainer: {
    marginTop: 20,
    width: 250, // Fixed width
    height: 50, // Fixed height
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#DB4437", // Google red color
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
    backgroundColor: "#cccccc", // Greyed-out when disabled
  },
});
