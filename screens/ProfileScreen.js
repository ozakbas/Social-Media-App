import React, { useState, useEffect } from "react";
import {
  Button,
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

export default function ProfileScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [posts, setPosts] = useState([]);

  const [connections, setConnections] = useState([]);
  const [topics, setTopics] = useState([]);
  const [locations, setLocations] = useState([]);

  const [ModalVisibility, setModalVisibility] = useState(false);
  const [ModalVisibility2, setModalVisibility2] = useState(false);
  const [ModalVisibility3, setModalVisibility3] = useState(false);
  const [CommentsVisibility, setCommentsVisibility] = useState(false);

  const [refresh, setRefresh] = useState(false);

  const [addConnection, setAddConnection] = useState("");
  const [addTopic, setAddTopic] = useState("");
  const [addLocation, setAddLocation] = useState("");

  function like(email, post_id) {
    setRefresh(true);
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

    fetch("http://192.168.1.25:3000/mobile/like", req)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.log("error", error));
  }
  function dislike(email, post_id) {
    setRefresh(true);
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

    fetch("http://192.168.1.25:3000/mobile/dislike", req)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.log("error", error));
  }

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

    fetch("http://192.168.1.25:3000/mobile/addConnection", req)
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

    fetch("http://192.168.1.25:3000/mobile/subscribeTopic", req)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.log("error", error));
    setAddTopic("");
  }
  function deletePost(post_id) {
    setRefresh(true);

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

    fetch("http://192.168.1.25:3000/mobile/deletePost", req)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.log("error", error));
  }

  function deleteAlert(post_id) {
    Alert.alert(
      "Are you sure?",
      "Your post will be deleted forever if you press OK.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => deletePost(post_id) },
      ],
      { cancelable: false }
    );
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

    fetch("http://192.168.1.25:3000/mobile/unsubscribeTopic", req)
      .then((response) => response.text())

      .catch((error) => console.log("error", error));
  }
  function deleteLocation(location) {
    setRefresh(true);

    var req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        location: location,
      }),
    };

    fetch("http://192.168.1.25:3000/mobile/unsubscribeLocation", req)
      .then((response) => response.text())

      .catch((error) => console.log("error", error));
  }
  function deleteConnection(connection) {
    setRefresh(true);
    console.log(JSON.stringify(connection));

    var req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        connection: connection,
      }),
    };

    fetch("http://192.168.1.25:3000/mobile/deleteConnection", req)
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

    fetch("http://192.168.1.25:3000/mobile/subscribeTopic", req)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.log("error", error));
  }
  function submitLocation() {
    setAddLocation("");
    setModalVisibility3(false);
    setRefresh(true);

    var req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        location: addLocation,
      }),
    };

    fetch("http://192.168.1.25:3000/mobile/subscribeLocation", req)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.log("error", error));
  }

  function getPosts(id) {
    var req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    };

    fetch(`http://192.168.1.25:3000/mobile/showMyPosts`, req)
      .then((response) => response.text())
      .then((result) => JSON.parse(result))
      .then((result) => {
        setPosts(result.posts.reverse());
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
      `http://192.168.1.25:3000/user/mobile/email/${encodeURIComponent(
        data.email
      )}`,
      req
    )
      .then((response) => response.text())
      .then((result) => JSON.parse(result))
      .then((result) => {
        setId(result.user._id);
        setUsername(result.user.username);
        setProfileImage(result.user.profileImage);
        setConnections(result.user.friends);
        setLocations(result.user.locations);
        setTopics(result.user.topics);
        getPosts(result.user._id);
      })
      .catch((error) => console.log("error", error));
  }

  const getData = async () => {
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
      <TouchableOpacity onPress={() => setRefresh(true)}>
        <Text>🔄</Text>
      </TouchableOpacity>
      <Text style={styles.username}>{username}</Text>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Image
          source={{
            uri: `http://192.168.1.25:3000/${profileImage}`,
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
    <View style={styles.itemView}>
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
              uri: `http://192.168.1.25:3000/${item.image}`,
            }}
            style={{ width: 300, height: 300, alignSelf: "center" }}
          />
        ) : (
          <Text></Text>
        )}
      </View>
      <Text>{item.topics}</Text>
      <View style={{ flexDirection: "row", margin: 10 }}>
        {Array.isArray(item.likes) && (
          <Text style={styles.title}>{JSON.stringify(item.likes.length)}</Text>
        )}
        <TouchableOpacity
          style={{
            backgroundColor: "lightgrey",
            alignSelf: "center",
          }}
          onPress={() => like(email, item._id)}
        >
          <Icon
            name="md-thumbs-up"
            color={"purple"}
            size={26}
            style={{
              marginRight: 10,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "lightgrey",
            alignSelf: "center",
          }}
          onPress={() => dislike(email, item._id)}
        >
          <Icon name="md-thumbs-down" color={"purple"} size={26} />
        </TouchableOpacity>
        {Array.isArray(item.likes) && (
          <Text style={styles.title}>
            {JSON.stringify(item.dislikes.length)}
          </Text>
        )}
        <TouchableOpacity
          style={{
            backgroundColor: "lightgrey",
            alignSelf: "center",
          }}
          onPress={() => navigation.navigate("Comment", { item, username, id })}
        >
          <Icon
            name="md-text"
            color={"purple"}
            size={26}
            style={{
              marginLeft: 30,
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => deleteAlert(item._id)}
          style={{ alignSelf: "flex-end", flex: 1 }}
        >
          <Text style={styles.delete}>delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderItem = ({ item }) => <Item item={item} />;

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
              <View style={{ marginBottom: 40, alignItems: "center" }}>
                <Text style={styles.title}>Add a connection</Text>
                <TextInput
                  style={styles.flatListInput}
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
            <View style={styles.greenItemView}>
              <Text style={styles.greenItem}>{item.username}</Text>
              <TouchableOpacity
                style={styles.deleteTouchable}
                onPress={() => deleteConnection(item.username)}
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
                  style={styles.flatListInput}
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
              <Text style={styles.greenItem}>{item}</Text>
              <TouchableOpacity
                style={styles.deleteItem}
                onPress={() => deleteTopic(item)}
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

        <FlatList
          data={locations}
          ListHeaderComponent={
            <View>
              <View style={{ marginBottom: 40, alignItems: "center" }}>
                <Text style={styles.title}>Subscribe to a location</Text>
                <TextInput
                  style={styles.flatListInput}
                  onChangeText={(text) => setAddLocation(text)}
                  value={addLocation}
                />
                <Button title="submit" onPress={() => submitLocation()} />
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.title}>Your locations</Text>
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
              <Text style={styles.greenItem}>{item}</Text>
              <TouchableOpacity
                style={styles.deleteItem}
                onPress={() => deleteLocation(item)}
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
      <Modal visible={CommentsVisibility} animationType="slide">
        <TouchableOpacity
          style={{
            alignContent: "stretch",
            alignItems: "flex-end",
          }}
          onPress={() => setCommentsVisibility(false)}
        >
          <Text style={{ fontSize: 20, color: "red", margin: 20 }}>close</Text>
        </TouchableOpacity>

        <FlatList
          data={locations}
          ListHeaderComponent={
            <View>
              <View style={{ marginBottom: 40, alignItems: "center" }}>
                <Text style={styles.title}>Add a comment</Text>
                <TextInput
                  style={styles.flatListInput}
                  onChangeText={(text) => setAddLocation(text)}
                  value={addLocation}
                />
                <Button title="submit" onPress={() => submitLocation()} />
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.title}>Comments</Text>
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
              <Text style={styles.greenItem}>{item}</Text>
              <TouchableOpacity
                style={styles.deleteItem}
                onPress={() => deleteLocation(item)}
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
    borderRadius: 20,
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
});
