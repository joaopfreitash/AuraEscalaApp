import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  View,
  Image,
  ScrollView,
  Text,
  Animated,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import styles from "@/src/styles/cadastroStyle";
import loginHooks from "@/src/hooks/loginHooks";
import { useRef, useState } from "react";
import FlashMessage from "react-native-flash-message";
import auth from "@react-native-firebase/auth";

export default function CadastrarScreen() {
  const {
    emailLabelAnimated,
    isEmailFocused,
    handleFocus,
    setIsEmailFocused,
    handleBlur,
  } = loginHooks();
  const alertEmail = useRef<FlashMessage | null>(null);
  const [email, setEmail] = useState("");

  // Função que envia o e-mail de redefinição de senha
  const handleSubmit = async () => {
    if (!email) {
      if (alertEmail.current) {
        alertEmail.current.showMessage({
          floating: true,
          statusBarHeight: -5,
          message: "Por favor, digite um e-mail.",
          type: "danger",
          duration: 4000,
          style: { alignItems: "center" },
        });
      }
      return;
    }
    try {
      await auth().sendPasswordResetEmail(email);
      if (alertEmail.current) {
        alertEmail.current.showMessage({
          floating: true,
          statusBarHeight: -5,
          message:
            "E-mail de redefinição enviado, verifique sua caixa de spam.",
          type: "success",
          duration: 6000,
          style: { alignItems: "center" },
        });
      }
    } catch (error) {
      if (alertEmail.current) {
        alertEmail.current.showMessage({
          floating: true,
          statusBarHeight: -5,
          message: "Ocorreu um erro, tente novamente.",
          type: "danger",
          duration: 4000,
          style: { alignItems: "center" },
        });
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.contentContainer}>
        <View style={styles.container}>
          <Image
            source={require("@/assets/images/auraescalas.png")}
            style={styles.image}
          />

          <Text style={styles.titleText}>
            Informe o seu e-mail cadastrado pelo administrador. Caso corresponda
            a um e-mail registrado em nosso sistema, enviaremos um link para
            redefinição de senha.
          </Text>

          <View style={styles.inputContainerCadastro}>
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
              onFocus={() => handleFocus(emailLabelAnimated, setIsEmailFocused)}
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
          <TouchableOpacity onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
        <FlashMessage ref={alertEmail} />
      </View>
    </TouchableWithoutFeedback>
  );
}
