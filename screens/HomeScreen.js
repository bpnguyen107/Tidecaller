import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';


const HomeScreen = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <Text>Hello, world! bruh i hate my life</Text>
      <StatusBar style="auto" />
      <TouchableOpacity>
      <Text> bruh</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;