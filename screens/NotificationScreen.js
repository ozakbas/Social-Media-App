import React, { Component } from "react";
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
import { postRequest } from "../fetchComponents";

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
    };
  }

  componentDidMount() {
    this.getData();

    this.focusSubscription = this.props.navigation.addListener("focus", () => {
      this.getData();
    });
  }

  getNotifications(email) {
    var data = {
      email: email,
    };
    postRequest(data, "showNotifications", true)
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

      if (value !== null) {
        // value previously stored
      }
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };

  openPost(email, notifId, postId) {
    var data = {
      email: email,
      id: notifId,
    };

    console.log(notifId);
    console.log(postId);

    postRequest(data, "notificationRead", false);
    this.props.navigation.navigate("SinglePost", { postId });
  }

  openOldPost(postId) {
    this.props.navigation.navigate("SinglePost", { postId });
  }

  render() {
    const notifications = this.state.notifications
      .filter(function (item) {
        return item.isRead == false;
      })
      .map((item) => (
        <TouchableOpacity
          onPress={() =>
            this.openPost(this.state.email, item._id, item.post._id)
          }
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
          onPress={() => this.openOldPost(item.post._id)}
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
