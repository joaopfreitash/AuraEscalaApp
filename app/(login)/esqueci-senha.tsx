import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { View, Image, ScrollView, Text, Animated, TextInput, TouchableOpacity } from 'react-native';

import styles from '@/src/styles/loginStyle';
import loginHooks from '@/src/hooks/loginHooks';

export default function EsqueciSenhaScreen() {
  const { emailLabelAnimated, isEmailFocused, email, setEmail,
          handleFocus, setIsEmailFocused, handleBlur
        } = loginHooks();
  
  return (
    <ScrollView scrollEnabled={false} contentContainerStyle={styles.contentContainer}>
        <View style={styles.container}>

          <Image source={require('@/assets/images/auraPlantaoLogo.png')} style={styles.image} />

          <Text style={styles.titleText}>
            Informe o e-mail que você usa para login, enviaremos um link para redefinição de senha.
          </Text>

          <View style={styles.inputContainerEsqueci}>
          <Animated.Text style={[styles.inputLabel, {
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
              outputRange: ['400', '600'], // Tornar o rótulo em negrito
            }),
          }]} >
            E-mail
          </Animated.Text>
          <TextInput style={styles.input}
            placeholder={!isEmailFocused ? "E-mail" : ""}
            placeholderTextColor="#191a1c"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            onFocus={() => handleFocus(emailLabelAnimated, setIsEmailFocused)}
            onBlur={() => handleBlur(emailLabelAnimated, email, setIsEmailFocused)}
          />
          <MaterialIcons name="alternate-email" size={24} color="black" style={styles.iconEmail} />
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>

        </View>
    </ScrollView>
  );
}
