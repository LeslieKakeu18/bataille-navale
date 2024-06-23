import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function Soldier({ position, size, isOpponent }) {
  const imageSource = isOpponent
    ? require('../../assets/soldier.png') // Remplacez par votre image pour le soldat adverse
    : require('../../assets/soldier.png'); // Remplacez par votre image pour le soldat du joueur

  return (
    <View style={[
      styles.soldier,
      {
        width: size,
        height: size,
        left: position.x - size / 2,
        top: position.y - size / 2,
      }
    ]}>
      <Image source={imageSource} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  soldier: {
    position: 'absolute',
  },
});

