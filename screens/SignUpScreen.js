import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { AuthContext } from "../context/auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

export function SignUpLogic(username, email, password) {
  return new Promise((resolve, reject) => {
    var data = {
      username: username,
      email: email,
      password: password,
    };

    var req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    var myUrl = "http://192.168.1.27:3000/signup";

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

  const { signUp } = useContext(AuthContext);

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem("@logged_in_email", value);
    } catch (e) {
      // saving error
    }
  };

  function handleSubmit(username, email, password) {
    SignUpLogic(username, email, password).then((result) => {
      if (result.message == "Email or username already exist.")
        return Alert.alert(result.message);
      else if (result.message == "Signed up successfully. You can login now.") {
        signUp({ username, password });
        storeData(email);
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
          onPress={() => handleSubmit(username, email, password)}
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
