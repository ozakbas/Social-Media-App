import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert, TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function submitPostLogic(email, caption, topics, location, image) {
  return new Promise((resolve, reject) => {
    var req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        caption: caption,
        topics: topics,
        location: location,
        // image: image,
      }),
    };

    fetch("http://192.168.1.27:3000/mobile/addPost", req)
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

export default function PostScreen({ navigation }) {
  const [email, setemail] = useState("");
  const [caption, setcaption] = useState("");
  const [topics, settopics] = useState("");
  const [location, setlocation] = useState("");
  const [image, setimage] = useState("");

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("@logged_in_email");
      setemail(value);

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
    //setRefresh(false);
  }, []);

  function submitPost() {
    submitPostLogic(email, caption, topics, location, image);

    navigation.goBack();
  }

  const askForPermission = async () => {
    const permissionResult = await Permissions.askAsync(Permissions.CAMERA);
    if (permissionResult.status !== "granted") {
      Alert.alert(" No permissions to access camera", [{ text: "ok" }]);
      return false;
    }
    return true;
  };

  const takeImage = async () => {
    // make sure that we have the permission
    const hasPermission = await askForPermission();
    if (!hasPermission) {
      return;
    } else {
      // launch the camera with the following settings
      let img = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 3],
        quality: 0.3,
        base64: true,
      });
      // make sure a image was taken:
      if (!img.cancelled) {
        const data = new FormData();
        data.append("name", "avatar");
        data.append("fileData", {
          uri: img.uri,
          type: img.type,
          name: img.fileName,
        });
        console.log(data.uri);
        console.log(data.type);
        console.log(data.name);

        setimage(JSON.stringify(img.base64));
      }
    }
  };
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={styles.title}>Share with the world!</Text>
      <View style={{ marginTop: 50, marginBottom: 20 }}>
        <TextInput
          placeholder="caption"
          style={styles.textInput}
          value={caption}
          onChangeText={setcaption}
        />
        <TextInput
          placeholder="topics"
          style={styles.textInput}
          value={topics}
          onChangeText={settopics}
        />
        <TextInput
          placeholder="location"
          style={styles.textInput}
          value={location}
          onChangeText={setlocation}
        />

        <TouchableOpacity onPress={() => takeImage()}>
          <Text style={{ fontSize: 20, textAlign: "center", margin: 20 }}>
            Take a foto
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ margin: 15 }} onPress={() => submitPost()}>
          <LinearGradient
            start={[0, 0.5]}
            end={[1, 0.5]}
            colors={["#5f2c82", "#49a09d"]}
            style={{ borderRadius: 15 }}
          >
            <View style={styles.circleGradient}>
              <Text style={styles.visit}>SUBMIT</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
