import * as React from "react";
import { Button, View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { AuthContext } from "../context/auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignInScreen() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { signIn } = React.useContext(AuthContext);

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem("@logged_in_email", value);
    } catch (e) {
      // saving error
    }
  };

  function handleSubmit(email, password) {
    var data = {
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

    fetch("http://192.168.1.25:3000/login", req)
      .then((response) => response.text())
      .then((result) => JSON.parse(result))
      .then((result) => {
        if (result.message == "Email does not exist") {
          console.log(result.message);
        } else if (result.message == "Password is not correct") {
          console.log(result.message);
        } else if (result.status == "success") {
          console.log(data.email);
          storeData(data.email);
          console.log(result.message);
          signIn({ email, password });
        }
      })
      .catch((error) => console.log("error", error));
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
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
      <Button title="Sign in" onPress={() => handleSubmit(email, password)} />
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    fontSize: 18,
    margin: 5,
    width: 350,

    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 26,
    margin: 10,
    fontWeight: "700",
    color: "#393939",
  },
});
