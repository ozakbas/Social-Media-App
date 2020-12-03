import * as React from "react";
import { Button, View, Text, StyleSheet, TextInput } from "react-native";

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={styles.title}>Welcome</Text>
      <Button title="Log in" onPress={() => navigation.navigate("SignIn")} />
      <View
        style={{
          borderBottomColor: "black",
          borderBottomWidth: 20,
        }}
      />
      <Button title="Sign up" onPress={() => navigation.navigate("SignUp")} />
    </View>
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
  square: {
    width: 100,
    height: 100,
    backgroundColor: "grey",
    marginBottom: 10,
  },
  post: {
    backgroundColor: "grey",
  },
  title: {
    fontSize: 20,
    marginBottom: 50,
    fontWeight: "700",
    color: "#393939",
    margin: 10,
  },
});
