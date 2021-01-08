import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { AuthContext } from "../context/auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";

export function SignUpLogic(username, email, password, device_token) {
  return new Promise((resolve, reject) => {
    var data = {
      username: username,
      email: email,
      password: password,
      device_token: device_token,
    };

    var req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    var myUrl = "http://192.168.1.32:3000/mobile/signup";

    fetch(myUrl, req)
      .then((response) => response.text())
      .then((result) => JSON.parse(result))
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("error", error);
        reject();
      });
  });
}

export default function SignUpScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [device_token, set_device_token] = useState("");

  const { signUp } = useContext(AuthContext);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const storEmail = async (email) => {
    try {
      await AsyncStorage.setItem("@logged_in_email", email);
    } catch (e) {
      // saving error
      console.log(e);
    }
  };

  const registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      set_device_token(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  };

  function handleSubmit(username, email, password, device_token) {
    SignUpLogic(username, email, password, device_token).then((result) => {
      if (result.message == "Email or username already exist.")
        return Alert.alert(result.message);
      else if (result.message == "Signed up successfully. You can login now.") {
        signUp({ username, password });
        storeEmail(email);
      } else {
        return Alert.alert(result.message);
      }
    });
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 60,
        marginLeft: 60,
      }}
    >
      <Text style={styles.title}>Let's create your account</Text>
      <View style={{ marginTop: 50, marginBottom: 20 }}>
        <TextInput
          placeholder="Username"
          style={styles.textInput}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="Email"
          style={styles.textInput}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          style={styles.textInput}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={{ margin: 15 }}
          onPress={() => handleSubmit(username, email, password, device_token)}
        >
          <LinearGradient
            start={[0, 0.5]}
            end={[1, 0.5]}
            colors={["#5f2c82", "#49a09d"]}
            style={{ borderRadius: 15 }}
          >
            <View style={styles.circleGradient}>
              <Text style={styles.visit}>SIGN UP</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  visit: {
    margin: 4,
    padding: 5,
    textAlign: "center",
    color: "#393939",
    fontSize: 20,
    fontWeight: "700",
  },
  circleGradient: {
    margin: 3,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
  },
  textInput: {
    fontSize: 18,
    margin: 5,
    width: 300,
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 35,
    margin: 30,
    fontWeight: "700",
    color: "#393939",
    textAlign: "center",
  },
});
