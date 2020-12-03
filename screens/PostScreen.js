import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Alert,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { TouchableOpacity } from "react-native-gesture-handler";

import AsyncStorage from "@react-native-async-storage/async-storage";
export default function PostScreen({ navigation }) {
  const [email, setemail] = React.useState("");
  const [caption, setcaption] = React.useState("");
  const [topics, settopics] = React.useState("");
  const [location, setlocation] = React.useState("");
  const [image, setimage] = React.useState("");

  const getData = async () => {
    console.log("getdata workin");
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

  React.useEffect(() => {
    getData();
    //setRefresh(false);
  }, []);

  function submitPost() {
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
        //image: image,
      }),
    };

    console.log(email);
    console.log(caption);
    console.log(topics);
    console.log(location);

    fetch("http://192.168.1.30:3000/mobile/addPost", req)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.log("error", error));

    navigation.goBack();
  }

  const askForPermission = async () => {
    const permissionResult = await Permissions.askAsync(Permissions.CAMERA);
    if (permissionResult.status !== "granted") {
      Alert.alert("no permissions to access camera!", [{ text: "ok" }]);
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
        quality: 1,
        base64: true,
      });
      // make sure a image was taken:
      if (!img.cancelled) {
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

        <Button title="Submit" onPress={() => submitPost()} />
      </View>
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
