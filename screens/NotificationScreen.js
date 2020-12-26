import React, { Component } from "react";
import {
  Button,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

export default class NotificationScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      conversations: "",
      person: "",
      email: "",
    };
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem("@logged_in_email");
      this.setState({ email: value });
      this.getConversations(value);

      if (value !== null) {
        // value previously stored
      }
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };

  componentDidMount() {
    this.getData();
    this.focusSubscription = this.props.navigation.addListener("focus", () => {
      this.getData();
    });
  }

  render() {
    return (
      <View>
        <Text>notif screen</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  textInput: {
    fontSize: 18,
    margin: 5,
    width: 250,

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
