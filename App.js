import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "./context/auth-context";

import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import LoadingScreen from "./screens/LoadingScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import PostScreen from "./screens/PostScreen";
import CommentScreen from "./screens/CommentScreen";
import ConversationScreen from "./screens/ConversationScreen";
import Tabs from "./Tabs";

const Stack = createStackNavigator();

export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem("userToken");
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: "RESTORE_TOKEN", token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        try {
          const jsonValue = JSON.stringify(data);
          await AsyncStorage.setItem("user_object", jsonValue);
        } catch (e) {
          console.log("error in setAsyncStorage ");
        }

        dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
      },
      signOut: () => dispatch({ type: "SIGN_OUT" }),
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
      },
    }),
    []
  );

  function getHeaderTitle(route) {
    // If the focused route is not found, we need to assume it's the initial screen
    // This can happen during if there hasn't been any navigation inside the screen
    // In our case, it's "Feed" as that's the first screen inside the navigator
    const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";

    switch (routeName) {
      case "Home":
        return "Home Feed";
      case "Chat":
        return "Chat";
      case "Profile":
        return "My profile";
      case "Notifications":
        return "Notifications";
    }
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {state.isLoading ? (
            // We haven't finished checking for the token yet
            <Stack.Screen name="Loading" component={LoadingScreen} />
          ) : state.userToken == null ? (
            // No token found, user isn't signed in
            <>
              <Stack.Screen
                name="Welcome"
                component={WelcomeScreen}
                options={{
                  title: "Welcome",
                  // When logging out, a pop animation feels intuitive
                  animationTypeForReplace: state.isSignout ? "pop" : "push",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="SignIn"
                component={SignInScreen}
                options={{
                  title: "Sign in",
                  // When logging out, a pop animation feels intuitive
                  animationTypeForReplace: state.isSignout ? "pop" : "push",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{
                  title: "Sign up",
                  // When logging out, a pop animation feels intuitive
                  animationTypeForReplace: state.isSignout ? "pop" : "push",
                  headerShown: false,
                }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Tabs"
                component={Tabs}
                options={({ route }) => ({
                  headerTitle: getHeaderTitle(route),
                  headerStyle: { backgroundColor: "lightgrey" },
                  headerTintColor: "#fff",
                  headerTitleAlign: "center",
                  headerTitleStyle: { fontSize: 20 },
                })}
              />
              <Stack.Screen
                name="Post"
                component={PostScreen}
                options={() => ({
                  headerTitle: "Submit a Post",
                  headerStyle: { backgroundColor: "lightgrey" },
                  headerTintColor: "#fff",
                  headerTitleAlign: "center",
                  headerTitleStyle: { fontSize: 20 },
                })}
              />
              <Stack.Screen
                name="Comment"
                component={CommentScreen}
                options={() => ({
                  headerTitle: "Comments",
                  headerStyle: { backgroundColor: "#1f65ff" },
                  headerTintColor: "#fff",
                  headerTitleAlign: "center",
                  headerTitleStyle: { fontSize: 20 },
                })}
              />
              <Stack.Screen
                name="Conversation"
                component={ConversationScreen}
                options={() => ({
                  headerTitle: "Conversation",
                  headerStyle: { backgroundColor: "#1f65ff" },
                  headerTintColor: "#fff",
                  headerTitleAlign: "center",
                  headerTitleStyle: { fontSize: 25 },
                })}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
