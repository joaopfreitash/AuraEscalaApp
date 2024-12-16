import { Animated } from "react-native";
import { useRef, useState } from "react";

const searchBar = () => {
  const searchBarWidth = useRef(new Animated.Value(100)).current;
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleFocusSearchBar = () => {
    setIsSearchFocused(true);
    Animated.timing(searchBarWidth, {
      toValue: 80, // Diminui a largura para 80%
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlurSearchbar = () => {
    if (!searchQuery) {
      Animated.timing(searchBarWidth, {
        toValue: 100,
        duration: 200,
        useNativeDriver: false,
      }).start();
      setIsSearchFocused(false);
    }
  };

  return {
    handleFocusSearchBar,
    handleBlurSearchbar,
    searchBarWidth,
    isSearchFocused,
    setIsSearchFocused,
    searchQuery,
    setSearchQuery,
  };
};

export default searchBar;
