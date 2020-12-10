import React, { useState, useEffect } from "react";
import {
  Button,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";

import { AuthContext } from "../context/auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";

export default function HomeScreen({ navigation }) {
  const { signOut } = React.useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [posts, setPosts] = useState([]);

  const [refresh, setRefresh] = useState(false);

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

    fetch("http://192.168.1.25:3000/mobile/getNewsfeed", req)
      .then((response) => response.text())
      .then((result) => JSON.parse(result))
      .then((result) => {
        console.log(result);
        setPosts(result.data);
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
        setUsername(result.user.username);
        setId(result.user._id);
      })
      .catch((error) => console.log("error", error));
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

  const Bio = () => (
    <View style={{ margin: 10 }}>
      <Text>Signed in!</Text>
      <Button title="Sign out" onPress={signOut} />
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
          onPress={() => console.log(item._id)}
          style={{ alignSelf: "flex-end", flex: 1 }}
        >
          <Text style={styles.delete}>report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderItem = ({ item }) => <Item item={item} />;
  return (
    <View>
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
