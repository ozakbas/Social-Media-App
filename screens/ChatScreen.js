import React, { useState, useEffect } from "react";
import {
  Button,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  TextInput,
} from "react-native";
import io from "socket.io-client";

export default function ChatScreen() {
  useEffect(() => {
    const socket = io("http://192.168.1.25:3000");
  }, []);

  const [conversations, setConversations] = useState([]);

  const [person, setPerson] = useState("");

  return (
    <View>
      <Text style={styles.title}>Start a new conversation</Text>
      <View style={{ marginTop: 20, marginBottom: 20 }}>
        <TextInput
          placeholder="enter username"
          style={styles.textInput}
          value={person}
          onChangeText={setPerson}
        />
        <Button title="Submit" onPress={() => console.log(person)} />
      </View>

      <FlatList
        data={conversations}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "center",
              backgroundColor: "grey",
              margin: 15,
              padding: 15,
            }}
          >
            <Text style={styles.greenItem}>{item} </Text>
          </View>
        )}
        keyExtractor={(item) => item}
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
