import React from "react";
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
  const [id, setId] = React.useState(route.params.id);
  const [postId, setpostId] = React.useState(route.params.item._id);
  const [username, setUsername] = React.useState(route.params.username);
  const [comment, setcomment] = React.useState("");

  const [commentArray, setcommentArray] = React.useState(
    route.params.item.comments
  );

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

    fetch("http://192.168.1.23:3000/mobile/addComment", req)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.log("error", error));

    console.log(route.params);
    console.log(postId);
    console.log(id);
    console.log(username);
    console.log(comment);

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
