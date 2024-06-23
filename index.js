import { AppRegistry } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './src/components/WelcomeScreen';
import WaitingRoom from './src/components/WaitingRoom';
import GameScreen from './src/components/GameScreen';
import GameOverScreen from './src/components/GameOverScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="WaitingRoom" component={WaitingRoom} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="GameOver" component={GameOverScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Enregistrez le composant principal de votre application
AppRegistry.registerComponent('MonJeuDeBataille', () => App);

// Si vous utilisez le fichier index.js plutôt que App.js
// AppRegistry.registerComponent(appName, () => App);

export default App;

