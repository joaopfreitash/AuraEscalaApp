import { Link, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlashMessage from "react-native-flash-message";

import styles from "@/src/styles/loginStyle";
import loginHooks from "@/src/hooks/loginHooks";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const alertLogin = useRef<FlashMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
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
  } = loginHooks();

  const handleLogin = async () => {
    if (!email || !senha) {
      if (alertLogin.current) {
        alertLogin.current.showMessage({
          message: "Por favor, insira um email e uma senha válidos.",
          floating: true,
          statusBarHeight: -5,
          type: "danger",
          duration: 4000,
          style: { alignItems: "center" },
        });
      }
      return;
    }
    setIsSubmitting(true);
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        senha
      );
      const user = userCredential.user;
      const userUid = user.uid;

      const userDocRef = firestore().collection("users").doc(userUid);
      const userDoc = await userDocRef.get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        if (userData) {
          const combinedUserData = {
            uid: user.uid,
            email: user.email,
            name: userData.name,
          };

          await AsyncStorage.setItem("@user", JSON.stringify(combinedUserData));

          if (userData.isAdmin) {
            handleRedirectAdmin();
          } else {
            handleRedirectUser();
          }
        } else {
          alert("Dados do usuário não encontrados.");
        }
      } else {
        alert("Usuário não encontrado no sistema.");
      }
    } catch (error) {
      if (alertLogin.current) {
        alertLogin.current.showMessage({
          message: "Falha no login: Verifique suas credenciais.",
          floating: true,
          statusBarHeight: -5,
          type: "danger",
          duration: 4000,
          style: { alignItems: "center" },
        });
      }
    } finally {
      setIsSubmitting(false); // Finaliza o envio, reabilita o botão
    }
  };

  const handleRedirectAdmin = () => {
    router.replace("/main-admin/(tabs)/home");
  };

  const handleRedirectUser = () => {
    router.replace("/main-user/(tabs)/home");
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        const userDocRef = firestore().collection("users").doc(user.uid);
        const userDoc = await userDocRef.get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          if (userData) {
            const combinedUserData = {
              uid: user.uid,
              email: user.email,
              name: userData.name,
            };
            await AsyncStorage.setItem(
              "@user",
              JSON.stringify(combinedUserData)
            );
            if (userData.isAdmin) {
              handleRedirectAdmin();
            } else {
              handleRedirectUser();
            }
          } else {
            console.error("Dados do usuário não encontrados.");
          }
        }
      } else {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" color="white" />
      </View>
    );
  }

  return (
    <>
      <StatusBar
        backgroundColor="#012E40" // Cor de fundo da Status Bar
        barStyle="light-content" // Define o texto da Status Bar como claro (ícones/branco)
        translucent={false} // Faz com que a Status Bar não seja transparente
      />
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        style={{ paddingTop: insets.top + 10 }}
      >
        <View style={styles.contentContainer}>
          <View style={styles.container}>
            <Image
              source={require("@/assets/images/auraescalas.png")}
              style={styles.image}
            />

            {/* Campo de Email */}
            <View style={styles.inputContainerIndex}>
              <Animated.Text
                style={[
                  styles.inputLabel,
                  {
                    top: emailLabelAnimated.interpolate({
                      inputRange: [0, 1],
                      outputRange: [18, -20], // Mover o rótulo para cima
                    }),
                    fontSize: emailLabelAnimated.interpolate({
                      inputRange: [0, 1],
                      outputRange: [16, 12], // Diminuir o tamanho do rótulo
                    }),
                    fontWeight: emailLabelAnimated.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["400", "600"], // Tornar o rótulo em negrito
                    }),
                  },
                ]}
              >
                E-mail
              </Animated.Text>
              <TextInput
                style={styles.input}
                placeholder={!isEmailFocused ? "E-mail" : ""}
                placeholderTextColor="#191a1c"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                onFocus={() =>
                  handleFocus(emailLabelAnimated, setIsEmailFocused)
                }
                onBlur={() =>
                  handleBlur(emailLabelAnimated, email, setIsEmailFocused)
                }
              />
              <MaterialIcons
                name="alternate-email"
                size={24}
                color="black"
                style={styles.iconEmail}
              />
            </View>

            {/* Campo de Senha */}
            <View style={styles.inputContainer}>
              <Animated.Text
                style={[
                  styles.inputLabel,
                  {
                    top: senhaLabelAnimated.interpolate({
                      inputRange: [0, 1],
                      outputRange: [18, -20], // Mover o rótulo para cima
                    }),
                    fontSize: senhaLabelAnimated.interpolate({
                      inputRange: [0, 1],
                      outputRange: [16, 12], // Diminuir o tamanho do rótulo
                    }),
                    fontWeight: senhaLabelAnimated.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["400", "600"], // Tornar o rótulo em negrito
                    }),
                  },
                ]}
              >
                Senha
              </Animated.Text>
              <TextInput
                style={styles.input}
                placeholder={!isSenhaFocused ? "Senha" : ""}
                placeholderTextColor="#191a1c"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
                onFocus={() =>
                  handleFocus(senhaLabelAnimated, setIsSenhaFocused)
                }
                onBlur={() =>
                  handleBlur(senhaLabelAnimated, senha, setIsSenhaFocused)
                }
              />
              <FontAwesome
                name="lock"
                size={24}
                color="#29292e"
                style={styles.iconPass}
              />
            </View>

            {/* Botão Entrar */}
            <TouchableOpacity
              style={[styles.button, { opacity: isSubmitting ? 0.6 : 1 }]}
              onPress={() => {
                Keyboard.dismiss();
                handleLogin();
              }}
              disabled={isSubmitting}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.buttonText}>Entrar</Text>
                {isSubmitting && (
                  <ActivityIndicator
                    style={{ marginLeft: 10 }}
                    size="small"
                    color="white"
                  />
                )}
              </View>
            </TouchableOpacity>

            {/* Links */}
            <Link href="/esqueci-senha" asChild style={styles.linkEsqueci}>
              <TouchableOpacity>
                <Text style={styles.textEsqueci}>Esqueci a senha</Text>
              </TouchableOpacity>
            </Link>
          </View>
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              Sua primeira vez acessando o App?
            </Text>
            <Link href={"/cadastrar"} asChild style={styles.button}>
              <TouchableOpacity>
                <Text style={styles.buttonText}>Clica aqui</Text>
              </TouchableOpacity>
            </Link>
          </View>
          <FlashMessage ref={alertLogin} />
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}
