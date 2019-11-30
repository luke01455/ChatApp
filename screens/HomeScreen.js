import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import io from 'socket.io-client';
import { GiftedChat } from 'react-native-gifted-chat';

export default function HomeScreen() {

// useState to set the state of the message to send
const [messageToSend, setMessageToSend] = useState("");

// useState to set the state of the message which will be received and shown on screen
const [recvMessages, setRecvMessages] = useState([]);

// useRef to avoid scoping issues with useEffect
const socket = useRef(null);


// useEffect to listen to backend, send a message to backend and set the messages which have already been sent - which update on reload component
  useEffect(() => {
    socket.current = io("http://192.168.0.10:3001");
    socket.current.on("message", message => {
      const testMessage =       {
        _id: 3,
        text: 'Hello developer!',
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        }
      }
      testMessage.text = message;
    setRecvMessages(prevState => GiftedChat.append(prevState, testMessage));
    });

    //using bootstrap suggested message setup
    setRecvMessages([
      {
        _id: 1,
        text: 'Hello developer!',
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: 'Hello from myself!',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      }
    ]);
  }, []);

  // function which sends the message to send to the backend, then clears out the text view box
  const sendMessage = messages => {
    console.log(messages)
    socket.current.emit("message", messages[0].text);
  };

  return (
    <View style={{ flex: 1}}>
    {/* // Gifted chat bootstrap UI message view */}
      <GiftedChat
        // shows the recvMessages state array as the messages
        messages={recvMessages}
        // sends a preditermined array from the repo which also contains the text from the chatbox
        onSend={messages => sendMessage(messages)}
        user={{
          _id: 1,
        }}
      />
    {/* Code which makes the app pad around the keyboard when user needs to type something */}
   {
      Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />
   }
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
