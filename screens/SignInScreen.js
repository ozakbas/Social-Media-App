import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../context/auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

import { postRequest } from "../fetchComponents";

export default function SignInScreen() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [device_token, set_device_token] = useState("");

  const { signIn } = React.useContext(AuthContext);

  const storeEmail = async (email) => {
    try {
      await AsyncStorage.setItem("@logged_in_email", email);
    } catch (e) {
      // saving error
      console.log(e);
    }
  };

  function handleSubmit(email, password, device_token) {
    var data = {
      email: email,
      password: password,
      device_token: device_token,
    };

    postRequest(data, "login", true).then((result) => {
      if (
        result.message == "Email does not exist" ||
        result.message == "Password is not correct"
      ) {
        return Alert.alert(result.message);
      } else if (result.status == "success") {
        storeEmail(email);
        return signIn({ email, password });
      }
    });
  }

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

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
      <View style={{ marginTop: 50, marginBottom: 20, alignSelf: "center" }}>
        <Text style={styles.title}>Sign in</Text>

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
          onPress={() => handleSubmit(email, password, device_token)}
        >
          <LinearGradient
            start={[0, 0.5]}
            end={[1, 0.5]}
            colors={["#5f2c82", "#49a09d"]}
            style={{ borderRadius: 15 }}
          >
            <View style={styles.circleGradient}>
              <Text style={styles.visit}>SUBMIT</Text>
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
  buttonView: {
    margin: 20,
    alignItems: "center",
    borderRadius: 15,
    borderColor: "#fefefe",
    borderWidth: 3,
    padding: 5,
    marginLeft: 70,
    marginRight: 70,
    padding: 10,
  },
});
