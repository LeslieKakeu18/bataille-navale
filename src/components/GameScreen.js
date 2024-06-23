import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Dimensions, Alert, Text } from 'react-native';
import { savePlayerScore, listenToPlayerScores, updateSoldierPositions, listenToRoom } from '../utils/Networking';
import GameHeader from './GameHeader';
import Soldier from './Soldier';
import { firestore } from '../../firebase';

export default function GameScreen({ route, navigation }) {
  const [playerSoldiers, setPlayerSoldiers] = useState([]);
  const [opponentSoldiers, setOpponentSoldiers] = useState([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameAreaSize, setGameAreaSize] = useState({ width: 0, height: 0 });
  const [playerSoldierSize, setPlayerSoldierSize] = useState(0);
  const [opponentSoldierSize, setOpponentSoldierSize] = useState(0);
  const [playersInfo, setPlayersInfo] = useState({
    player1: { name: '', score: 0 },
    player2: { name: '', score: 0 }
  });
  const [currentTurn, setCurrentTurn] = useState('');
  const [showTurnText, setShowTurnText] = useState(false); // État pour afficher le texte du tour
  const { roomId, playerName } = route.params;

  useEffect(() => {
    const { width, height } = Dimensions.get('window');
    const headerHeight = 50; // Hauteur du GameHeader
    const footerHeight = 60; // Hauteur approximative pour le bouton terminer la partie

    const gameAreaHeight = height - headerHeight - footerHeight;
    setGameAreaSize({ width, height: gameAreaHeight });

    const soldierSize = Math.min(width, gameAreaHeight) / 5; // Pour 5 soldats maximum
    setPlayerSoldierSize(soldierSize);
    setOpponentSoldierSize(soldierSize); // Taille identique pour l'adversaire pour cet exemple
  }, []);

  useEffect(() => {
    const roomRef = firestore().collection('rooms').doc(roomId);

    const unsubscribe = listenToRoom(roomId, (roomData) => {
      setPlayersInfo({
        player1: { name: roomData.player1.name, score: roomData.player1.score },
        player2: { name: roomData.player2.name, score: roomData.player2.score }
      });
      setCurrentTurn(roomData.currentTurn);
      setGameStarted(roomData.gameStarted);
      setPlayerSoldiers(roomData.player1.name === playerName ? roomData.player1.soldiers : roomData.player2.soldiers);
      setOpponentSoldiers(roomData.player1.name === playerName ? roomData.player2.soldiers : roomData.player1.soldiers);
    });

    return () => {
      unsubscribe();
    };
  }, [roomId, playerName]);

  useEffect(() => {
    // Au chargement de la partie, déterminez aléatoirement qui commence
    if (gameStarted && !currentTurn) {
      const startingTurn = Math.random() < 0.5 ? playersInfo.player1.name : playersInfo.player2.name;
      setCurrentTurn(startingTurn);
      setShowTurnText(true); // Afficher le texte du tour après avoir déterminé le premier joueur
    }
  }, [gameStarted, currentTurn, playersInfo]);

  const handleSoldierPlacement = (event) => {
    if (currentTurn !== playerName) return;

    const { locationX, locationY } = event.nativeEvent;
    if (playerSoldiers.length < 5) {
      const newSoldiers = [...playerSoldiers, { x: locationX, y: locationY }];
      setPlayerSoldiers(newSoldiers);

      updateSoldierPositions(roomId, playerName, newSoldiers, opponentSoldiers);

      if (newSoldiers.length === 5) {
        Alert.alert("Placement terminé", "La partie peut commencer!");
        setGameStarted(true);
      }
    }
  };

  const handleGameTouch = (event) => {
    if (!gameStarted || currentTurn !== playerName) return;

    const { locationX, locationY } = event.nativeEvent;
    let opponentSoldierHit = false;
    const updatedOpponentSoldiers = [...opponentSoldiers];

    opponentSoldiers.forEach((soldier, index) => {
      const deltaX = Math.abs(soldier.x - locationX);
      const deltaY = Math.abs(soldier.y - locationY);
      if (deltaX < opponentSoldierSize / 2 && deltaY < opponentSoldierSize / 2) {
        updatedOpponentSoldiers.splice(index, 1);
        opponentSoldierHit = true;
      }
    });

    if (opponentSoldierHit) {
      setOpponentSoldiers(updatedOpponentSoldiers);
      setScore(score + 1);

      updateSoldierPositions(roomId, playerName, playerSoldiers, updatedOpponentSoldiers);

      if (updatedOpponentSoldiers.length === 0) {
        endGame();
      }
    }
  };

  const endGame = () => {
    savePlayerScore(roomId, playerName, score);
    navigation.navigate('GameOver', { roomId });
  };

  return (
    <View style={styles.container}>
      {!gameStarted ? (
        <Text style={styles.modeText}>Mode Placement</Text>
      ) : (
        <Text style={styles.modeText}>Mode Jeu</Text>
      )}
      <GameHeader
        player1Name={playersInfo.player1.name}
        player1Score={playersInfo.player1.score}
        player2Name={playersInfo.player2.name}
        player2Score={playersInfo.player2.score}
        currentTurn={currentTurn}
      />
      <View style={[styles.gameArea, { width: gameAreaSize.width, height: gameAreaSize.height }]} onTouchStart={handleSoldierPlacement} onTouchEnd={handleGameTouch}>
        {playerSoldiers.map((soldier, index) => (
          <Soldier key={index} position={soldier} size={playerSoldierSize} />
        ))}
        {opponentSoldiers.map((soldier, index) => (
          <Soldier key={index} position={soldier} size={opponentSoldierSize} isOpponent />
        ))}
      </View>
      {showTurnText && (
        <Text style={styles.turnText}>{`${currentTurn === playerName ? 'Votre tour' : `Tour de ${currentTurn}`}`}</Text>
      )}
      {gameStarted && (
        <Button title="Terminer la partie" onPress={endGame} />
      )}
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
  gameArea: {
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  turnText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});
