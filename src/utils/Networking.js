import { firestore } from '../../firebase';

export const addPlayerToWaitingRoom = async (deviceName) => {
  try {
    const waitingRoomRef = firestore().collection('waitingRoom').doc(deviceName);
    await waitingRoomRef.set({
      gameStarted: false,
      players: firestore.FieldValue.arrayUnion(deviceName)
    });
  } catch (error) {
    console.error('Error adding player to waiting room:', error);
    throw error;
  }
};

export const listenToWaitingRoomPlayers = (callback) => {
  const waitingRoomRef = firestore().collection('waitingRoom');
  const unsubscribe = waitingRoomRef.onSnapshot((snapshot) => {
    const players = [];
    snapshot.forEach((doc) => {
      players.push({ id: doc.id, ...doc.data() });
    });
    callback(players);
  });

  return unsubscribe;
};

export const removePlayerFromWaitingRoom = async (deviceName) => {
  try {
    const waitingRoomRef = firestore().collection('waitingRoom').doc(deviceName);
    await waitingRoomRef.delete();
  } catch (error) {
    console.error('Error removing player from waiting room:', error);
    throw error;
  }
};

export const updateGameStartedStatus = async (deviceName, gameStarted) => {
  try {
    const waitingRoomRef = firestore().collection('waitingRoom').doc(deviceName);
    await waitingRoomRef.update({ gameStarted });
  } catch (error) {
    console.error('Error updating game started status:', error);
    throw error;
  }
};

export const updatePlayersInWaitingRoom = async (deviceName, players) => {
  try {
    const waitingRoomRef = firestore().collection('waitingRoom').doc(deviceName);
    await waitingRoomRef.update({ players });
  } catch (error) {
    console.error('Error updating players in waiting room:', error);
    throw error;
  }
};

// Update soldier positions and switch turn
export const updateSoldierPositions = async (roomId, playerName, playerSoldiers, opponentSoldiers) => {
  const roomRef = firestore().collection('rooms').doc(roomId);

  try {
    const roomDoc = await roomRef.get();
    if (roomDoc.exists) {
      const roomData = roomDoc.data();
      const nextTurn = roomData.player1.name === playerName ? roomData.player2.name : roomData.player1.name;

      if (roomData.player1.name === playerName) {
        await roomRef.update({
          'player1.soldiers': playerSoldiers,
          currentTurn: nextTurn
        });
      } else if (roomData.player2.name === playerName) {
        await roomRef.update({
          'player2.soldiers': opponentSoldiers,
          currentTurn: nextTurn
        });
      } else {
        throw new Error('Player not in room');
      }
    } else {
      throw new Error('Room does not exist');
    }
  } catch (error) {
    console.error('Error updating soldier positions:', error);
    throw error;
  }
};

