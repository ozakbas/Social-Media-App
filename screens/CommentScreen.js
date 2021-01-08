import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function CommentScreen({ route, navigation }) {
  const [id, setId] = useState(route.params.id);
  const [postId, setpostId] = useState(route.params.item._id);
  const [username, setUsername] = useState(route.params.username);
  const [comment, setcomment] = useState("");

  const [commentArray, setcommentArray] = useState(route.params.item.comments);

  function sendNotif(message, username, postId) {
    var req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        username: username,
        postId: postId,
      }),
    };

    fetch("http://192.168.1.32:3000/mobile/expoNotification", req)
      .then((response) => response.text())
      .then((result) => JSON.parse(result))
      .then((result) => {
        console.log(result);
      })

      .catch((error) => console.log("error", error));
  }
  function postComment() {
    var req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: postId,
        userId: id,
        username: username,
        comment: comment,
      }),
    };

    fetch("http://192.168.1.32:3000/mobile/addComment", req)
      .then((response) => response.text())
      .then((result) => {
        sendNotif("commented on your post.", username, post_id);
        console.log(result);
      })
      .catch((error) => console.log("error", error));

    navigation.goBack();
  }

  return (
    <View style={{ flex: 1, margin: 20, marginRight: 40 }}>
      <FlatList
        data={commentArray}
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <Text style={styles.name}>{item.username}: </Text>
            <Text style={styles.text}>{item.comment}</Text>
          </View>
        )}
        keyExtractor={(item) => item._id}
      />

      <View style={{ marginBottom: 20, flexDirection: "row" }}>
        <TextInput
          placeholder="add a comment"
          style={styles.textInput}
          value={comment}
          onChangeText={setcomment}
        />
        <TouchableOpacity
          style={{
            alignSelf: "center",
          }}
          onPress={() => postComment()}
        >
          <Icon name="md-send" color={"blue"} size={40} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  comment: {
    flexDirection: "row",
    padding: 10,
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
