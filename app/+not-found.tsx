import { View, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Não encontrado', headerStyle: {backgroundColor: '#081e27'}, headerTitleStyle: {fontWeight: 'bold'},  headerTintColor: '#fff' }
        } />
      <View style={styles.container}>
        <Link href="/" style={styles.button}>
          Volte para a página inicial!
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#012E40',
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});
