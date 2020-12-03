import React, { useState, useEffect } from "react";
import {
  Button,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
} from "react-native";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import Icon from "react-native-vector-icons/Ionicons";

import HomeScreen from "./screens/HomeScreen";

import { FlatList, TextInput } from "react-native-gesture-handler";

import AsyncStorage from "@react-native-async-storage/async-storage";

function ChatScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

function ProfileScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [posts, setPosts] = useState([
    {
      id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      title: "You have no posts",
    },
  ]);

  const [connections, setConnections] = useState([]);
  const [topics, setTopics] = useState([]);
  const [locations, setLocations] = useState([]);

  const [ModalVisibility, setModalVisibility] = useState(false);
  const [ModalVisibility2, setModalVisibility2] = useState(false);
  const [ModalVisibility3, setModalVisibility3] = useState(false);

  const [refresh, setRefresh] = useState(false);

  const [addConnection, setAddConnection] = useState("");
  const [addTopic, setAddTopic] = useState("");
  const [addLocation, setAddLocation] = useState("");

  function submitConnection() {
    setModalVisibility(false);
    setRefresh(true);
    console.log(addConnection);

    var req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        username: addConnection,
      }),
    };

    fetch("http://192.168.1.30:3000/mobile/addConnection", req)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.log("error", error));
    setAddConnection("");
  }

  function submitTopic() {
    setModalVisibility2(false);
    setRefresh(true);

    var req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        topic: addTopic,
      }),
    };

    fetch("http://192.168.1.30:3000/mobile/subscribeTopic", req)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.log("error", error));
    setAddTopic("");
  }

  function deletePost(post_id) {
    console.log(post_id);

    var req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        _id: post_id,
      }),
    };

    fetch("http://192.168.1.30:3000/mobile/deletePost", req)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.log("error", error));
  }

  function deleteTopic(topic) {
    setRefresh(true);

    var req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        topic: topic,
      }),
    };

    fetch("http://192.168.1.30:3000/mobile/unsubscribeTopic", req)
      .then((response) => response.text())

      .catch((error) => console.log("error", error));
  }

  function submitTopic() {
    setAddTopic("");
    setModalVisibility2(false);
    setRefresh(true);

    var req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        topic: addTopic,
      }),
    };

    fetch("http://192.168.1.30:3000/mobile/subscribeTopic", req)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.log("error", error));
  }

  function getUserInfo(email) {
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
      `http://192.168.1.30:3000/user/mobile/email/${encodeURIComponent(
        data.email
      )}`,
      req
    )
      .then((response) => response.text())
      .then((result) => JSON.parse(result))
      .then((result) => {
        setUsername(result.user.username);
        setPosts(result.user.posts.reverse());
        setProfileImage(result.user.profileImage);
        setConnections(result.user.friends);
        setTopics(result.user.topics);
        setLocations(result.user.locations);
      })
      .catch((error) => console.log("error", error));
  }

  const getData = async () => {
    console.log("getdata workin");
    try {
      const value = await AsyncStorage.getItem("@logged_in_email");
      setEmail(value);
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
  const Bio = () => (
    <View style={{ margin: 10 }}>
      <Text
        style={{
          fontSize: 40,
          marginBottom: 10,
          fontWeight: "700",
          color: "#393939",
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        {username}
      </Text>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Image
          source={{
            uri: `http://192.168.1.30:3000/${profileImage}`,
          }}
          style={{ width: 120, height: 120, borderRadius: 40 }}
        />
        <TouchableOpacity>
          <Text style={{ textAlign: "center" }}>change profile picture</Text>
        </TouchableOpacity>
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
      <View style={{ margin: 20 }}>
        <Button
          title="Create a new post"
          onPress={() => navigation.navigate("Post")}
        />
      </View>

      <View style={{ marginTop: 20 }}>
        <Text style={styles.title}>My Posts</Text>
      </View>
    </View>
  );
  const Item = ({ item }) => (
    <View
      style={{
        backgroundColor: "lightgrey",
        margin: 10,
        borderRadius: 20,
        padding: 20,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <Text style={{ flex: 1, fontSize: 17, textAlign: "left" }}>
          {username}
        </Text>
        <Text style={{ flex: 1, fontSize: 17, textAlign: "right" }}>
          📍{item.location}
        </Text>
      </View>

      <Text style={styles.title}>{item.caption}</Text>
      <View>
        {item.image != "" ? (
          <Image
            source={{
              uri: `http://192.168.1.30:3000/${item.image}`,
            }}
            style={{ width: 300, height: 300, alignSelf: "center" }}
          />
        ) : (
          <Text></Text>
        )}
      </View>
      <Text>{item.topics}</Text>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ fontSize: 18, margin: 5 }}>45👍</Text>
        <Text style={{ fontSize: 18, margin: 5 }}>5👎</Text>
        <Text style={{ fontSize: 18, margin: 5 }}>7💬</Text>
        <TouchableOpacity
          onPress={() => deletePost(item._id)}
          style={{ alignSelf: "flex-end", flex: 1 }}
        >
          <Text
            style={{
              fontSize: 18,
              margin: 5,
              textAlign: "right",
              color: "red",
            }}
          >
            delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderItem = ({ item }) => <Item item={item} />;

  return (
    <View style={{ margin: 10 }}>
      <Modal visible={ModalVisibility} animationType="slide">
        <TouchableOpacity
          style={{
            alignContent: "stretch",
            alignItems: "flex-end",
          }}
          onPress={() => setModalVisibility(false)}
        >
          <Text style={{ fontSize: 20, color: "red", margin: 20 }}>close</Text>
        </TouchableOpacity>

        <FlatList
          data={connections}
          ListHeaderComponent={
            <View>
              <View style={{ marginBottom: 40, alignItems: "center" }}>
                <Text style={styles.title}>Add a connection</Text>
                <TextInput
                  style={{
                    height: 40,
                    width: 150,
                    borderWidth: 2,
                    margin: 20,
                    fontSize: 20,
                    padding: 10,
                  }}
                  onChangeText={(text) => setAddConnection(text)}
                  value={addConnection}
                />
                <Button title="submit" onPress={() => submitConnection()} />
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.title}>Your connections</Text>
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
              <Text
                style={{
                  backgroundColor: "lightgreen",
                  borderRadius: 20,
                  margin: 10,
                  width: 150,
                  textAlign: "center",
                  alignSelf: "center",
                  fontSize: 20,
                }}
              >
                {item.friend.username}
              </Text>
              <TouchableOpacity
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 50,
                  alignItems: "center",
                }}
                onPress={() => deleteConnection(item.friends)}
              >
                <Text style={{ color: "red", fontSize: 20, fontWeight: "700" }}>
                  X
                </Text>
              </TouchableOpacity>
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
              <View style={{ marginBottom: 40, alignItems: "center" }}>
                <Text style={styles.title}>Subscribe to a topic</Text>
                <TextInput
                  style={{
                    height: 40,
                    width: 150,
                    borderWidth: 2,
                    margin: 20,
                    fontSize: 20,
                    padding: 10,
                  }}
                  onChangeText={(text) => setAddTopic(text)}
                  value={addTopic}
                />
                <Button title="submit" onPress={() => submitTopic()} />
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.title}>Your topics</Text>
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
              <Text
                style={{
                  backgroundColor: "lightgreen",
                  borderRadius: 20,
                  margin: 10,
                  width: 150,
                  textAlign: "center",
                  alignSelf: "center",
                  fontSize: 20,
                }}
              >
                {item.topic}
              </Text>
              <TouchableOpacity
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 50,
                  alignItems: "center",
                }}
                onPress={() => deleteTopic(item.topic)}
              >
                <Text style={{ color: "red", fontSize: 20, fontWeight: "700" }}>
                  X
                </Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item._id}
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
        <Text>{locations}</Text>
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

const Tab = createMaterialBottomTabNavigator();

const Tabs = () => (
  <Tab.Navigator initialRouteName="Home" activeColor="#fff" shifting>
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarLabel: "Home",
        tabBarColor: "#009387",
        tabBarIcon: ({ color }) => (
          <Icon name="ios-home" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Chat"
      component={ChatScreen}
      options={{
        tabBarLabel: "Conversations",
        tabBarColor: "#1f65ff",
        tabBarIcon: ({ color }) => (
          <Icon name="ios-chatbubbles" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarLabel: "Profile",
        tabBarColor: "#694fad",
        tabBarIcon: ({ color }) => (
          <Icon name="ios-person" color={color} size={26} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default Tabs;

const styles = StyleSheet.create({
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
});
