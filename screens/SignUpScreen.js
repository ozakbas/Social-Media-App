import * as React from "react";
import { Button, View, Text, StyleSheet, TextInput } from "react-native";
import { AuthContext } from "../context/auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignUpScreen() {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { signUp } = React.useContext(AuthContext);

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem("@logged_in_email", value);
    } catch (e) {
      // saving error
    }
  };

  function handleSubmit(username, email, password) {
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

    fetch("http://192.168.1.30:3000/signup", req)
      .then((response) => response.text())
      .then((result) => JSON.parse(result))
      .then((result) => {
        if (result.message == "Email or username already exist.")
          console.log(result.message);
        else if (
          result.message == "Signed up successfully. You can login now."
        ) {
          signUp({ username, password });
          console.log(result);
          console.log(data.email);
          storeData(data.email);
        } else {
          console.log(result.message);
        }
      })
      .catch((error) => console.log("error", error));
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
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
        <Button
          title="Sign in"
          onPress={() => handleSubmit(username, email, password)}
        />
      </View>
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
