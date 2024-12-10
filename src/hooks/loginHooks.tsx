import { useRef, useState } from "react";
import { Animated } from "react-native";

const loginHooks = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    
    const emailLabelAnimated = useRef(new Animated.Value(0)).current;
    const senhaLabelAnimated = useRef(new Animated.Value(0)).current;

    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [isSenhaFocused, setIsSenhaFocused] = useState(false);

    const handleFocus = (animatedValue: Animated.Value, setIsFocused: React.Dispatch<React.SetStateAction<boolean>>) => {
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }).start();
        setIsFocused(true);
      };
    
      const handleBlur = (animatedValue: Animated.Value, text: string, setIsFocused: React.Dispatch<React.SetStateAction<boolean>>) => {
        if (!text) {
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }).start();
        }
        setIsFocused(false);
      };
  

  return { emailLabelAnimated, isEmailFocused, email, setEmail, handleFocus,
    setIsEmailFocused, handleBlur, senhaLabelAnimated, isSenhaFocused,
    senha, setSenha, setIsSenhaFocused, };
};

export default loginHooks;
