import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";

export class HomeLogic {
  static like(email, post_id) {
    return new Promise((resolve, reject) => {
      var req = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          postId: post_id,
        }),
      };

      fetch("http://192.168.1.27:3000/mobile/like", req)
        .then((response) => response.text())
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          console.log("error", error);
          reject();
        });
    });
  }

  static dislike(email, post_id) {
    return new Promise((resolve, reject) => {
      var req = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          postId: post_id,
        }),
      };

      fetch("http://192.168.1.27:3000/mobile/dislike", req)
        .then((response) => response.text())
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          console.log("error", error);
          reject();
        });
    });
  }

  static getUserInfo(email) {
    return new Promise((resolve, reject) => {
      var data = {
        email: email,
      };

      var req = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        email: email,
      };

      fetch(
        `http://192.168.1.27:3000/user/mobile/email/${encodeURIComponent(
          data.email
        )}`,
        req
      )
        .then((response) => response.text())
        .then((result) => JSON.parse(result))
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          console.log("error", error);
          reject();
        });
    });
  }
}

export default function HomeScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [posts, setPosts] = useState([]);

  const [refresh, setRefresh] = useState(false);

  function report(post_id) {
    var req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postid: post_id,
      }),
    };
    fetch("http://192.168.1.27:3000/mailSend", req)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.log("error", error));
  }

  function like(email, post_id) {
    setRefresh(true);
    HomeLogic.like(email, post_id);
  }

  function dislike(email, post_id) {
    setRefresh(true);
    HomeLogic.dislike(email, post_id);
  }

  function getFeed(value) {
    var req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: value,
      }),
    };

    fetch("http://192.168.1.27:3000/mobile/getNewsfeed", req)
      .then((response) => response.text())
      .then((result) => JSON.parse(result))
      .then((result) => {
        setPosts(result.data);
      })
      .catch((error) => console.log("error", error));
  }

  function getUserInfo(email) {
    HomeLogic.getUserInfo(email).then((result) => {
      setId(result.user._id);
      setUsername(result.user.username);
    });
  }
  const getData = async () => {
    console.log("getdata workin");
    try {
      const value = await AsyncStorage.getItem("@logged_in_email");
      setEmail(value);
      getFeed(value);
      getUserInfo(value);

      if (value !== null) {
        // value previously stored
      }
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };

  useEffect(() => {
    getData();

    setRefresh(false);
  }, [refresh]);

  useEffect(() => {
    const reRender = navigation.addListener("focus", () => {
      setRefresh(true);
    });

    return reRender;
  }, [navigation]);

  const Item = ({ item }) => (
    <LinearGradient style={styles.itemView} colors={["#2980b9", "#6dd5fa"]}>
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
            {item.user.username}
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
            📍{item.location}
          </Text>
        </View>

        <Text style={styles.title}>{item.caption}</Text>
        <View>
          {item.image != "" ? (
            <Image
              source={{
                uri: `http://192.168.1.27:3000/${item.image}`,
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
          {item.topics}
        </Text>
        <View style={{ flexDirection: "row", margin: 10 }}>
          {Array.isArray(item.likes) && (
            <Text
              style={{
                fontSize: 20,
                marginBottom: 10,
                fontWeight: "700",
                margin: 10,
                color: "#2E875D",
              }}
            >
              {JSON.stringify(item.likes.length)}
            </Text>
          )}
          <TouchableOpacity
            style={{
              alignSelf: "center",
            }}
            onPress={() => like(email, item._id)}
          >
            <Icon
              name="md-thumbs-up"
              color={"#2E875D"}
              size={26}
              style={{
                marginRight: 10,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignSelf: "center",
            }}
            onPress={() => dislike(email, item._id)}
          >
            <Icon name="md-thumbs-down" color={"#B5493E"} size={26} />
          </TouchableOpacity>
          {Array.isArray(item.likes) && (
            <Text
              style={{
                fontSize: 20,
                marginBottom: 10,
                fontWeight: "700",
                margin: 10,
                color: "#B5493E",
              }}
            >
              {JSON.stringify(item.dislikes.length)}
            </Text>
          )}
          <TouchableOpacity
            style={{
              alignSelf: "center",
            }}
            onPress={() =>
              navigation.navigate("Comment", { item, username, id })
            }
          >
            <Icon
              name="md-text"
              color={"#f5f5f5"}
              size={26}
              style={{
                marginLeft: 30,
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => report(item._id)}
            style={{
              alignItems: "flex-end",
              alignSelf: "flex-end",
              flex: 1,
              marginLeft: 100,
            }}
          >
            <Text style={{ color: "red", fontWeight: "700" }}>report</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );

  const renderItem = ({ item }) => <Item item={item} />;
  return (
    <View>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  visit: {
    margin: 4,
    padding: 5,
    textAlign: "center",
    color: "#393939",
    fontSize: 20,
    fontWeight: "700",
  },
  circleGradient: {
    margin: 3,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
  },
  deleteItem: {
    width: 30,
    height: 30,
    borderRadius: 50,
    alignItems: "center",
  },
  delete: {
    fontSize: 18,
    margin: 5,
    textAlign: "right",
    color: "red",
  },
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
    marginBottom: 10,
    fontWeight: "700",
    color: "#393939",
    margin: 10,
  },
  username: {
    fontSize: 40,
    marginBottom: 10,
    fontWeight: "700",
    color: "#393939",
    marginBottom: 10,
    textAlign: "center",
  },

  itemView: {
    backgroundColor: "lightgrey",
    margin: 10,
    borderRadius: 10,
    padding: 20,
  },
  modelTouchable: {
    alignContent: "stretch",
    alignItems: "flex-end",
  },

  flatListInput: {
    height: 40,
    width: 150,
    borderWidth: 2,
    margin: 20,
    fontSize: 20,
    padding: 10,
  },

  greenItem: {
    backgroundColor: "lightgreen",
    borderRadius: 20,
    margin: 10,
    width: 150,
    textAlign: "center",
    alignSelf: "center",
    fontSize: 20,
  },

  greenItemView: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },

  deleteTouchable: {
    width: 30,
    height: 30,
    borderRadius: 50,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "700",
    margin: 10,
    color: "#f5f5f5",
  },
});
