import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { firestore } from '../../firebase';

export default function GameOverScreen({ route, navigation }) {
  const { roomId } = route.params;
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [player1Score, setPlayer1Score] = useState(null);
  const [player2Score, setPlayer2Score] = useState(null);
  const [player1SoldiersEliminated, setPlayer1SoldiersEliminated] = useState(null);
  const [player2SoldiersEliminated, setPlayer2SoldiersEliminated] = useState(null);

  useEffect(() => {
    const roomRef = firestore().collection('rooms').doc(roomId);

    roomRef.get().then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        setPlayer1Name(data.player1);
        setPlayer2Name(data.player2);
      }
    });

    const unsubscribePlayer1 = roomRef.collection('players').doc('Player1').onSnapshot((doc) => {
      if (doc.exists) {
        const data = doc.data();
        setPlayer1Score(data.score);
        setPlayer1SoldiersEliminated(data.soldiersEliminated);
      }
    });

    const unsubscribePlayer2 = roomRef.collection('players').doc('Player2').onSnapshot((doc) => {
      if (doc.exists) {
        const data = doc.data();
        setPlayer2Score(data.score);
        setPlayer2SoldiersEliminated(data.soldiersEliminated);
      }
    });

    return () => {
      unsubscribePlayer1();
      unsubscribePlayer2();
    };
  }, [roomId]);

  const handleRestart = () => {
    navigation.navigate('WelcomeScreen');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleRestart} style={styles.restartButton}>
        <Image source={require('../../assets/soldier2.png')} style={styles.restartImage} />
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.title}>Partie Terminée</Text>
        <View style={styles.playerContainer}>
          <Text style={styles.playerTitle}>{player1Name}</Text>
          <Text style={styles.result}>Score: {player1Score}</Text>
          <Text style={styles.result}>Soldats éliminés: {player1SoldiersEliminated}</Text>
        </View>
        <View style={styles.playerContainer}>
          <Text style={styles.playerTitle}>{player2Name}</Text>
          <Text style={styles.result}>Score: {player2Score}</Text>
          <Text style={styles.result}>Soldats éliminés: {player2SoldiersEliminated}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: 20,
  },
  restartButton: {
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  restartImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  playerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  playerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  result: {
    fontSize: 18,
    marginBottom: 5,
  },
});
