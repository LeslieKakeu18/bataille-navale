import React from 'react';
import { View, Text, Image, Button, StyleSheet, Platform } from 'react-native';
import { addPlayerToWaitingRoom } from '../utils/Networking';
import DeviceInfo from 'react-native-device-info';

export default function WelcomeScreen({ navigation }) {
  const handleStartGame = async () => {
    try {
      const deviceName = Platform.OS === 'ios' ? await DeviceInfo.getDeviceName() : await DeviceInfo.getBrand();
      await addPlayerToWaitingRoom(deviceName);
      navigation.navigate('WaitingRoom');
    } catch (error) {
      console.error('Error adding player to waiting room:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/guerre.png')} style={styles.image} />
      <Text style={styles.text}>Bienvenue à la Bataille</Text>
      <Button title="Commencer" onPress={handleStartGame} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4B5320',
  },
  image: {
    width: 200,
    height: 200,
    // Ajoutez d'autres styles d'image ici si nécessaire
  },
  text: {
    fontSize: 24,
    marginVertical: 20,
    // Ajoutez d'autres styles de texte ici si nécessaire
  },
});


