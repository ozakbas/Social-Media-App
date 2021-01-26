import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";

import { getRequest, postRequest, getPost } from "../fetchComponents";

export default class SinglePostScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      post: {},
      postOwner: {},
      isDeleted: false,
    };
  }

  getUserInfo(email) {
    getRequest(email).then((result) => {
      this.setState({ username: result.user.username });
    });
  }

  getData = async () => {
    try {
      const email = await AsyncStorage.getItem("@logged_in_email");
      this.getUserInfo(email);
      this.setState({ email: email });
      this.getSinglePost();
      if (value !== null) {
        // value previously stored
      }
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };

  getSinglePost() {
    getPost(this.props.route.params.postId).then((result) => {
      result = JSON.parse(result);
      if (result.status == "error") {
        this.setState({ isDeleted: true });
      } else {
        this.setState({ post: result.post });
        this.setState({ postOwner: result.post.user });
      }
    });
  }

  componentDidMount() {
    this.getData();
  }

  PostDeleted() {
    return (
      <LinearGradient
        style={{ flex: 1, padding: 20 }}
        colors={["#2980b9", "#6dd5fa"]}
      >
        <Text
          style={{
            flex: 1,
            fontSize: 20,
            marginBottom: 10,
            fontWeight: "700",
            margin: 10,
            color: "#fefefe",
            textAlign: "center",
          }}
        >
          Post deleted :(
        </Text>
      </LinearGradient>
    );
  }

  PostReady(email, postOwner, post) {
    return (
      <View style={{ flex: 1 }}>
        <LinearGradient
          style={{ flex: 1, padding: 20 }}
          colors={["#2980b9", "#6dd5fa"]}
        >
          <View>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  flex: 1,
                  fontSize: 19,
                  marginBottom: 10,
                  fontWeight: "700",
                  margin: 10,
                  color: "#fefefe",
                }}
              >
                {postOwner.username}
              </Text>
              <Text
                style={{
                  fontSize: 17,
                  marginBottom: 10,
                  fontWeight: "700",
                  margin: 10,
                  color: "#fefefe",
                }}
              >
                📍{post.location}
              </Text>
            </View>

            <Text
              style={{
                fontSize: 20,
                marginBottom: 10,
                fontWeight: "700",
                margin: 10,
                color: "#fefefe",
              }}
            >
              {post.caption}
            </Text>
            <View>
              {post.image != "" ? (
                <Image
                  source={{
                    uri: `http://192.168.207.209:3000/${post.image}`,
                  }}
                  style={{ width: 300, height: 300, alignSelf: "center" }}
                />
              ) : (
                <Text></Text>
              )}
            </View>
            <Text
              style={{
                fontSize: 17,
                marginBottom: 10,
                fontWeight: "700",
                margin: 10,
              }}
            >
              {post.topics}
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  }
  render() {
    return !this.state.isDeleted
      ? this.PostReady(this.state.email, this.state.postOwner, this.state.post)
      : this.PostDeleted();
  }
}

const styles = StyleSheet.create({});
