import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";

import { postRequest } from "../fetchComponents";
import { getRequest } from "../fetchComponents";

export default function otherProfileScreen({ route, navigation }) {
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [posts, setPosts] = useState([]);

  const [loggedInUsername, setLoggedInUsername] = useState("");
  const [loggedInId, setLoggedInId] = useState("");

  const [connections, setConnections] = useState([]);
  const [topics, setTopics] = useState([]);
  const [locations, setLocations] = useState([]);

  const [ModalVisibility, setModalVisibility] = useState(false);
  const [ModalVisibility2, setModalVisibility2] = useState(false);
  const [ModalVisibility3, setModalVisibility3] = useState(false);

  const [refresh, setRefresh] = useState(false);

  function like(email, post_id) {
    var data = {
      email: email,
      postId: post_id,
    };
    postRequest(data, "like", false);
    setRefresh(true);
  }

  function dislike(email, post_id) {
    var data = {
      email: email,
      postId: post_id,
    };
    setRefresh(true);
    postRequest(data, "dislike", false);
  }

  function getPosts(id) {
    var data = { id: id };
    postRequest(data, "showMyPosts", true).then((result) => {
      setPosts(result.posts.reverse());
    });
  }

  function report(post_id) {
    var data = {
      postid: post_id,
    };
    postRequest(data, "mailSend", false);
  }

  function getUserInfo() {
    setId(route.params.item._id);
    setUsername(route.params.item.username);
    setProfileImage(route.params.item.profileImage);
    setConnections(route.params.item.friends);
    setLocations(route.params.item.locations);
    setTopics(route.params.item.topics);
    getPosts(route.params.item._id);
  }

  const getData = async () => {
    try {
      const email = await AsyncStorage.getItem("@logged_in_email");
      const loggedInUsername = await AsyncStorage.getItem(
        "@logged_in_username"
      );
      const loggedInId = await AsyncStorage.getItem("@logged_in_id");

      setEmail(email);
      setLoggedInUsername(loggedInUsername);
      setLoggedInId(loggedInId);

      getUserInfo();

      if (email !== null) {
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

  const Bio = () => (
    <View style={{ margin: 10 }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        {profileImage != "" ? (
          <Image
            source={{
              uri: `http://192.168.1.32:3000/${profileImage}`,
            }}
            style={{ width: 120, height: 120, borderRadius: 40 }}
          />
        ) : (
          <Image
            source={require("../assets/profile_icon.png")}
            style={{ width: 120, height: 120, borderRadius: 40 }}
          />
        )}

        <Text style={styles.username}>{username}</Text>
      </View>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => setModalVisibility(true)}
          style={{ flex: 1, alignItems: "center" }}
        >
          <Text style={styles.bigNumber}>{connections.length}</Text>
          <Text>connections</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalVisibility2(true)}
          style={{ flex: 1, alignItems: "center" }}
        >
          <Text style={styles.bigNumber}>{topics.length}</Text>
          <Text>followed</Text>
          <Text>topics</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalVisibility3(true)}
          style={{ flex: 1, alignItems: "center" }}
        >
          <Text style={styles.bigNumber}>{locations.length}</Text>
          <Text>followed</Text>
          <Text>locations</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text
          style={{
            fontSize: 20,
            marginBottom: 10,
            fontWeight: "700",
            color: "#393939",
            margin: 10,
          }}
        >
          Posts
        </Text>
      </View>
    </View>
  );

  const MyPost = ({ item }) => (
    <LinearGradient
      style={{ flex: 1, margin: 10, borderRadius: 10, padding: 20 }}
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
            {username}
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

        <Text
          style={{
            fontSize: 20,
            marginBottom: 10,
            fontWeight: "700",
            margin: 10,
            color: "#fefefe",
          }}
        >
          {item.caption}
        </Text>
        <View>
          {item.image != "" ? (
            <Image
              source={{
                uri: `http://192.168.1.32:3000/${item.image}`,
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
              navigation.navigate("Comment", {
                item,
                loggedInUsername,
                loggedInId,
              })
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
              marginLeft: 100,
            }}
          >
            <Text style={{ color: "red", fontWeight: "700" }}>report</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );

  const renderItem = ({ item }) => <MyPost item={item} />;

  return (
    <View style={{ margin: 10 }}>
      <Modal visible={ModalVisibility} animationType="slide">
        <TouchableOpacity
          style={styles.modelTouchable}
          onPress={() => setModalVisibility(false)}
        >
          <Text style={{ fontSize: 20, color: "red", margin: 20 }}>close</Text>
        </TouchableOpacity>

        <FlatList
          data={connections}
          ListHeaderComponent={
            <View>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.title}>Connections</Text>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.greenItemView}>
              <LinearGradient
                start={[0, 0.5]}
                end={[1, 0.5]}
                colors={["#1cd8d2", "#93edc7"]}
                style={{
                  backgroundColor: "red",
                  borderRadius: 20,
                  margin: 10,
                  width: 150,
                }}
              >
                <Text style={styles.greenItem}>{item.username}</Text>
              </LinearGradient>
            </View>
          )}
          keyExtractor={(item) => item._id}
        />
      </Modal>
      <Modal visible={ModalVisibility2} animationType="slide">
        <TouchableOpacity
          style={{
            alignContent: "stretch",
            alignItems: "flex-end",
          }}
          onPress={() => setModalVisibility2(false)}
        >
          <Text style={{ fontSize: 20, color: "red", margin: 20 }}>close</Text>
        </TouchableOpacity>

        <FlatList
          data={topics}
          ListHeaderComponent={
            <View>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.title}>Topics</Text>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              <LinearGradient
                start={[0, 0.5]}
                end={[1, 0.5]}
                colors={["#1cd8d2", "#93edc7"]}
                style={{
                  backgroundColor: "red",
                  borderRadius: 20,
                  margin: 10,
                  width: 150,
                }}
              >
                <Text style={styles.greenItem}>{item}</Text>
              </LinearGradient>
            </View>
          )}
          keyExtractor={(item) => item}
        />
      </Modal>
      <Modal visible={ModalVisibility3} animationType="slide">
        <TouchableOpacity
          style={{
            alignContent: "stretch",
            alignItems: "flex-end",
          }}
          onPress={() => setModalVisibility3(false)}
        >
          <Text style={{ fontSize: 20, color: "red", margin: 20 }}>close</Text>
        </TouchableOpacity>

        <FlatList
          data={locations}
          ListHeaderComponent={
            <View>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.title}>Locations</Text>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              <LinearGradient
                start={[0, 0.5]}
                end={[1, 0.5]}
                colors={["#1cd8d2", "#93edc7"]}
                style={{
                  backgroundColor: "red",
                  borderRadius: 20,
                  margin: 10,
                  width: 150,
                }}
              >
                <Text style={styles.greenItem}>{item}</Text>
              </LinearGradient>
            </View>
          )}
          keyExtractor={(item) => item}
        />
      </Modal>

      <FlatList
        data={posts}
        ListHeaderComponent={Bio}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  visit: {
    margin: 2,
    padding: 3,
    textAlign: "center",
    color: "#393939",
    fontSize: 16,
    fontWeight: "700",
  },
  circleGradient: {
    margin: 3,
    backgroundColor: "white",
    borderRadius: 10,
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
    margin: 10,
    color: "#393939",
  },
  whiteTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "700",
    margin: 10,
    color: "#fefefe",
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
    flex: 1,
    margin: 10,
    borderRadius: 10,
    padding: 20,
  },
  modelTouchable: {
    alignContent: "stretch",
    alignItems: "flex-end",
  },

  flatListInput: {
    fontSize: 18,
    margin: 5,
    width: 300,
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
    textAlign: "center",
  },

  greenItem: {
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
});
