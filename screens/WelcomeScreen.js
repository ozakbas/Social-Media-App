import * as React from "react";
import {
  Button,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function WelcomeScreen({ navigation }) {
  return (
    <LinearGradient
      style={{ flex: 1 }}
      //colors={["#962fbf", "#d62976", "#fa7e1e", "#feda75"]}
      //colors={["#5f2c82", "#49a09d"]}
      colors={["#1488cc", "#2b32b2"]}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <Text style={styles.title}>Welcome to the Social Media App!</Text>
        <View style={styles.buttonView}>
          <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
            <Text style={{ fontSize: 20, fontWeight: "700", color: "#fefefe" }}>
              SIGN IN
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonView}>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={{ fontSize: 20, fontWeight: "700", color: "#fefefe" }}>
              SIGN UP
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bigNumber: {
    fontSize: 40,
    marginBottom: 10,
    fontWeight: "700",
    color: "#393939",
    margin: 3,
  },
  title: {
    textAlign: "center",
    fontSize: 25,
    marginBottom: 50,
    fontWeight: "700",
    color: "#fefefe",
    margin: 10,
    marginLeft: 50,
    marginRight: 50,
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
