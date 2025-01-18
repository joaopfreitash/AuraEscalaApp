import { useRef, useState } from "react";
import { Animated, Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

const loginHooks = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const emailLabelAnimated = useRef(new Animated.Value(0)).current;
  const senhaLabelAnimated = useRef(new Animated.Value(0)).current;

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isSenhaFocused, setIsSenhaFocused] = useState(false);

  const handleFocus = (
    animatedValue: Animated.Value,
    setIsFocused: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setIsFocused(true);
  };

  const handleBlur = (
    animatedValue: Animated.Value,
    text: string,
    setIsFocused: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (!text) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    setIsFocused(false);
  };

  async function registerForPushNotificationsAsync() {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        handleRegistrationError(
          "Permission not granted to get push token for push notification!"
        );
        return;
      }
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        handleRegistrationError("Project ID not found");
      }
      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        console.log(pushTokenString);
        return pushTokenString;
      } catch (e: unknown) {
        handleRegistrationError(`${e}`);
      }
    } else {
      handleRegistrationError(
        "Must use physical device for push notifications"
      );
    }
  }

  function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
  }

  return {
    emailLabelAnimated,
    isEmailFocused,
    email,
    setEmail,
    handleFocus,
    setIsEmailFocused,
    handleBlur,
    senhaLabelAnimated,
    isSenhaFocused,
    senha,
    setSenha,
    setIsSenhaFocused,
    registerForPushNotificationsAsync,
  };
};

export default loginHooks;
