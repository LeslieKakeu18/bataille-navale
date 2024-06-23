import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { listenToWaitingRoomPlayers, removePlayerFromWaitingRoom } from '../utils/Networking';
import DeviceInfo from 'react-native-device-info';

export default function WaitingRoom({ navigation }) {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const unsubscribe = listenToWaitingRoomPlayers((players) => {
      setPlayers(players);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleStartGame = () => {
    if (players.length === 2) {
      Alert.alert('Prêt à jouer', 'La partie peut commencer !');
      navigation.navigate('Game');
    } else {
      Alert.alert('En attente', 'En attente d\'un autre joueur pour commencer la partie.');
    }
  };

  const handleCancel = async () => {
    try {
      await removePlayerFromWaitingRoom(DeviceInfo.getUniqueId());
      navigation.goBack();
    } catch (error) {
      console.error('Erreur lors de la suppression du joueur de la salle d\'attente :', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Salle d'attente</Text>
      <Text style={styles.subtitle}>Joueurs connectés :</Text>
      {players.map((player, index) => (
        <Text key={index}>{player.name}</Text>
      ))}
      <View style={styles.buttonContainer}>
        <Button
          title="Commencer la partie"
          onPress={handleStartGame}
          disabled={players.length !== 2}
          color="#7FFF00"
          style={[styles.roundedButton, styles.button]}
        />
        <Button
          title="Annuler"
          onPress={handleCancel}
          color="#7FFF00"
          style={[styles.roundedButton, styles.button]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  roundedButton: {
    borderRadius: 20,
    width: '40%',
  },
  button: {
    marginBottom: 10,
  },
});

