import React, { Component } from "react";
import {
  Button,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import { getRequest } from "../fetchComponents";
import { postRequest } from "../fetchComponents";

export default class Conversation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      chatMessage: "",
      chatMessages: props.route.params.item.messages,
      chatId: props.route.params.item.chatId,

      person: this.props.route.params.item.person[0],
    };
  }

  getUserInfo(email) {
    getRequest(email).then((result) => {
      this.setState({ username: result.user.username });
    });
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem("@logged_in_email");
      this.getUserInfo(value);

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
    this.props.navigation.setOptions({
      headerTitle: this.state.person,
    });

    this.socket = io("http://192.168.207.209:3000", {
      query: `roomId=${this.state.chatId}`,
    });

    this.socket.on("message", (arg) => {
      console.log(arg);

      this.setState({
        chatMessages: [...this.state.chatMessages, arg],
      });
    });
  }

  componentWillUnmount() {
    console.log(this.socket.id);
    this.socket.disconnect();
  }

  submitMessage() {
    console.log(this.state.chatMessage);
    const message = {
      sender: this.state.username,
      text: this.state.chatMessage,
    };

    this.socket.emit("message", message);

    const messageObject = [
      this.state.chatId,
      this.state.username,
      this.state.chatMessage,
    ];

    var data = {
      messageObject: messageObject,
    };

    postRequest(data, "sendMessage", true);

    this.setState({ chatMessage: "" });
  }

  render() {
    const chatMessages = this.state.chatMessages.map((item) => (
      <View
        style={[
          item.sender == this.state.person ? styles.notMine : styles.mine,
        ]}
      >
        <Text
          style={
            item.sender == this.state.person
              ? styles.notMineText
              : styles.mineText
          }
          key={(item) => item.text}
        >
          {item.text}
        </Text>
      </View>
    ));

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <ScrollView>{chatMessages}</ScrollView>

          <View style={{ flexDirection: "row", margin: 15 }}>
            <TextInput
              placeholder="enter a message"
              style={styles.textInput}
              value={this.state.chatMessage}
              onChangeText={(chatMessage) => {
                this.setState({ chatMessage });
              }}
            />
            <TouchableOpacity
              style={{
                alignSelf: "center",
              }}
              onPress={() => this.submitMessage()}
            >
              <Icon name="md-send" color={"blue"} size={40} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    fontSize: 18,
    margin: 5,
    flex: 4,

    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 26,
    margin: 10,
    fontWeight: "700",
    color: "#393939",
  },

  mine: {
    backgroundColor: "#00ce47",
    borderRadius: 10,
    margin: 5,
    padding: 10,
    alignSelf: "flex-end",
    maxWidth: 250,
  },

  notMine: {
    backgroundColor: "#ebebeb",
    borderRadius: 10,
    margin: 5,
    padding: 10,
    alignSelf: "flex-start",
    maxWidth: 250,
  },
  mineText: {
    fontSize: 20,
    color: "white",
  },
  notMineText: {
    fontSize: 20,
    color: "black",
  },
});
