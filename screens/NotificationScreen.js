import React, { Component, useState, useEffect, useRef } from "react";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { formatRelative } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";

const DateComponent = (props) => {
  var utcSeconds = props.item.createdAt;
  var d = new Date(utcSeconds);
  var x = formatRelative(d, new Date());
  return <Text style={{ textAlign: "right" }}>{x}</Text>;
};

export default class NotificationScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      notifications: [],
      expoPushToken: "",
    };
  }

  componentDidMount() {
    this.getData();
    this.focusSubscription = this.props.navigation.addListener("focus", () => {
      this.getData();
    });
  }

  registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
      this.setState({ expoPushToken: token });
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  };

  getNotifications(email) {
    var req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    };

    fetch("http://192.168.1.27:3000/mobile/showNotifications", req)
      .then((response) => response.text())
      .then((result) => JSON.parse(result))
      .then((result) => {
        this.setState({ notifications: result.data.reverse() });
      })

      .catch((error) => console.log("error", error));
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem("@logged_in_email");
      this.getNotifications(value);
      this.setState({ email: value });
      this.registerForPushNotificationsAsync();

      if (value !== null) {
        // value previously stored
      }
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };

  sendNotif(token, message) {
    var req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expo_token: token,
        message: message,
      }),
    };

    fetch("http://192.168.1.27:3000/mobile/expoNotification", req)
      .then((response) => response.text())
      .then((result) => JSON.parse(result))
      .then((result) => {
        console.log(result);
      })

      .catch((error) => console.log("error", error));
  }

  openPost(email, postId) {
    var req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        id: postId,
      }),
    };

    fetch("http://192.168.1.27:3000/mobile/notificationRead", req)
      .then((response) => response.text())
      .then((result) => JSON.parse(result))
      .then((result) => {
        console.log(result);
      })

      .catch((error) => console.log("error", error));
  }

  render() {
    const notifications = this.state.notifications
      .filter(function (item) {
        return item.isRead == false;
      })
      .map((item) => (
        <TouchableOpacity
          onPress={() => this.openPost(this.state.email, item._id)}
          key={item._id}
          style={{
            backgroundColor: "grey",
            margin: 5,
            padding: 10,
            flex: 1,
            borderRadius: 8,
          }}
        >
          <Text>{item.content}</Text>
          <DateComponent item={item} />
        </TouchableOpacity>
      ));
    const read_notifications = this.state.notifications
      .filter(function (item) {
        return item.isRead == true;
      })
      .map((item) => (
        <TouchableOpacity
          onPress={() => console.log(item.post._id)}
          key={item._id}
          style={{
            backgroundColor: "grey",
            margin: 5,
            padding: 10,
            flex: 1,
            borderRadius: 8,
          }}
        >
          <Text>{item.content}</Text>
          <DateComponent item={item} />
        </TouchableOpacity>
      ));

    return (
      <ScrollView>
        <TouchableOpacity
          onPress={() =>
            this.sendNotif(this.state.expoPushToken, "umut liked your message!")
          }
        >
          <Text>try the notification</Text>
        </TouchableOpacity>
        {notifications.length != 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.title}>New notifications</Text>
            <ScrollView>{notifications}</ScrollView>
          </View>
        )}
        <Text style={styles.title}>Notification History</Text>
        <View style={{ backgroundColor: "white", opacity: 0.4 }}>
          <ScrollView>{read_notifications}</ScrollView>
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    margin: 10,
    fontWeight: "700",
    color: "#393939",
  },
});
