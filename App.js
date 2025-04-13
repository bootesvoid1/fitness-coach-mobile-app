import { SafeAreaView, StyleSheet } from 'react-native';
import FitnessCoachChatbot from './components/FitnessCoachChatbot'
import FoodTracker from './components/FoodTracker';
// or any files within the Snack


export default function App() {
  return (
     <SafeAreaView style={styles.container}>
       {/* <FitnessCoachChatbot /> */}
      <FoodTracker />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
