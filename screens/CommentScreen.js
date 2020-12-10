import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  FlatList,
} from "react-native";
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

    fetch("http://192.168.1.25:3000/mobile/addComment", req)
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
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text style={styles.title}>Add a comment</Text>
      <View style={{ marginTop: 50, marginBottom: 20 }}>
        <TextInput
          placeholder="comment"
          style={styles.textInput}
          value={comment}
          onChangeText={setcomment}
        />
        <Button title="Submit" onPress={() => postComment()} />
      </View>

      <FlatList
        data={commentArray}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <Text style={styles.greenItem}>{item.username} </Text>
            <Text style={styles.greenItem}>{item.comment}</Text>
          </View>
        )}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    fontSize: 18,
    margin: 5,
    width: 350,

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
