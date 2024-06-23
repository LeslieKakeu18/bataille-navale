import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GameHeader({ player1Name, player1Score, player2Name, player2Score }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{player1Name} {player1Score} : {player2Name} {player2Score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
