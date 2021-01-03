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

export default function LoadingScreen() {
  return (
    <LinearGradient style={{ flex: 1 }} colors={["#1488cc", "#2b32b2"]}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <Text style={styles.title}>Loading</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
});
