import * as React from "react";
import {
  Button,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function LoadingScreen() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Text style={styles.title}>Post</Text>
    </View>
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
