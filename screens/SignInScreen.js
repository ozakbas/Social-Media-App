import * as React from "react";
import {
  Button,
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

    fetch("http://192.168.1.23:3000/login", req)
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
          onPress={() => handleSubmit(email, password)}
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
