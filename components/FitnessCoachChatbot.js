import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import {useState} from 'react';
const FitnessCoachChatbot = () => {
  
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { type: 'bot', text: "Hi, I'm your personal coach, what can I do for you?" },
  ]);


  const chatbotResponse = (message) => {
    if (message.includes('workout')) {
      return 'For a good workout, focus on strength training and cardio. Mix them for the best results!';
    } else if (message.includes('diet')) {
      return 'A balanced diet is key. Include lean protein, vegetables, healthy fats, and complex carbs.';
    } else if (message.includes('recovery')) {
      return 'Recovery is just as important as working out. Get enough sleep and stay hydrated.';
    } else if (message.includes('cardio')) {
      return 'Cardio exercises like running, cycling, and swimming improve heart health.';
    } else if (message.includes('water')) {
      return 'It’s important to drink at least 8 glasses of water a day to stay hydrated, especially during exercise.';
    } else if (message.includes('sleep')) {
      return 'Aim for 7-9 hours of sleep per night to help your muscles recover and improve overall well-being.';
    } else {
      return 'I’m here to help! You can ask about workouts, diet, water intake, sleep, or recovery.';
    }
  };

  // Function to handle user input and update chat history
  const handleSendMessage = () => {
    if (userMessage.trim()) {
      const newChat = [
        ...chatHistory,
        { type: 'user', text: userMessage },
        { type: 'bot', text: chatbotResponse(userMessage.toLowerCase()) },
      ];
      setChatHistory(newChat);
      setUserMessage('');
    }
  };

  // Render each message in the chat
  const renderMessage = ({ item }) => (
    <View style={item.type === 'user' ? styles.userMessage : styles.botMessage}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chatHistory}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        style={styles.chatWindow}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask your fitness question..."
          value={userMessage}
          onChangeText={setUserMessage}
        />
        <Button title="Send" onPress={handleSendMessage} />
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#f2f2f2',
    padding: 10,
  },
  chatWindow: {
    flex: 1,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    marginVertical: 5,
    padding: 10,
    maxWidth: '80%',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    marginVertical: 5,
    padding: 10,
    maxWidth: '80%',
  },
  messageText: {
    color: '#000',
  },
});

export default FitnessCoachChatbot;
