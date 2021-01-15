import React, { Component, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { postRequest } from "../fetchComponents";

export default class SearchScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: "",
      users: [],
      locations: [],
      topics: [],
      recommend: true,
      recommendation_results: [],
    };
  }

  getData = async () => {
    const email = await AsyncStorage.getItem("@logged_in_email");
    let data = { email: email };
    postRequest(data, "getRecommendations", true).then((result) => {
      this.setState({ recommendation_results: result.users });
    });
  };

  componentDidMount() {
    this.getData();
  }

  search() {
    this.setState({ recommend: false });
    var data = {
      query: this.state.query,
    };
    postRequest(data, "search", true).then((result) => {
      this.setState({ users: result.data });
    });

    postRequest(data, "searchTopics", true).then((result) => {
      this.setState({ topics: result.data });
    });

    postRequest(data, "searchLocations", true).then((result) => {
      this.setState({ locations: result.data });
    });

    this.setState({ query: "" });
  }

  render() {
    const mapRecommendations = this.state.recommendation_results.map((item) => (
      <View style={styles.topic}>
        <Text style={styles.itemText}>{item.username}</Text>
      </View>
    ));
    const mapTopics = this.state.topics.map((item) => (
      <View style={styles.topic}>
        <Text style={styles.itemText}>{item.topic}</Text>
      </View>
    ));

    const mapLocations = this.state.locations.map((item) => (
      <View style={styles.location}>
        <Text style={styles.itemText}>{item.location}</Text>
      </View>
    ));

    const mapUsers = this.state.users.map((item) => (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate("otherProfile", { item })}
      >
        <LinearGradient
          start={[0, 1]}
          end={[1, 0]}
          style={{
            backgroundColor: "#f5a140",
            margin: 10,
            padding: 15,
            borderRadius: 10,
            width: 200,
          }}
          colors={["#fc4a1a", "#fd805e"]}
        >
          <Text style={{ fontSize: 20, color: "#F6F6F6" }}>
            {item.username}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    ));

    return (
      <ScrollView style={{ flex: 1, margin: 20, marginRight: 40 }}>
        <View style={{ marginBottom: 20, flexDirection: "row" }}>
          <TextInput
            placeholder="search anything"
            style={styles.textInput}
            value={this.state.query}
            onChangeText={(text) => this.setState({ query: text })}
          />
          <TouchableOpacity
            style={{
              alignSelf: "center",
            }}
            onPress={() => this.search()}
          >
            <Icon name="md-search" color={"blue"} size={40} />
          </TouchableOpacity>
        </View>
        {this.state.recommend && (
          <View>
            <Text style={styles.title}>Recommended users for you</Text>
            <View>{mapRecommendations}</View>
          </View>
        )}
        <ScrollView horizontal={true}>
          <View style={{ flexDirection: "row" }}>{mapTopics}</View>
        </ScrollView>
        <ScrollView horizontal={true}>
          <View style={{ flexDirection: "row" }}>{mapLocations}</View>
        </ScrollView>
        {this.state.users.length != 0 && (
          <View>
            <Text style={styles.title}>Users</Text>

            {mapUsers}
          </View>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  topic: {
    backgroundColor: "green",
    margin: 5,
    padding: 5,
    borderRadius: 5,
  },
  location: {
    backgroundColor: "purple",
    margin: 5,
    padding: 5,
    borderRadius: 5,
  },

  itemText: {
    fontSize: 17,
    color: "#F6F6F6",
  },

  name: {
    fontSize: 20,
    textAlign: "left",
    fontWeight: "700",
  },
  text: {
    fontSize: 20,
  },
  textInput: {
    fontSize: 20,
    margin: 10,
    width: 280,

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
