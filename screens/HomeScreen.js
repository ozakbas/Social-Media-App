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

export default function HomeScreen() {
  const { signOut } = React.useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [posts, setPosts] = useState([]);

  const [refresh, setRefresh] = useState(false);

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

    fetch("http://192.168.1.30:3000/mobile/getNewsfeed", req)
      .then((response) => response.text())
      .then((result) => JSON.parse(result))
      .then((result) => {
        console.log(result);
        setPosts(result.data);
      })
      .catch((error) => console.log("error", error));
  }

  const getData = async () => {
    console.log("getdata workin");
    try {
      const value = await AsyncStorage.getItem("@logged_in_email");
      setEmail(value);
      getFeed(value);

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
          {item.user.username}
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
