import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [userData, setUserData] = useState(null);

  // Load user data from AsyncStorage when the component mounts
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    loadUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Ionicons name="mic-outline" size={80} color="#4A90E2" />
      <Text style={styles.title}>VoiceMeet</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Start a Meeting</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
        <Text style={styles.buttonText}>Join a Meeting</Text>
      </TouchableOpacity>

      {/* Display user information */}
      {userData && (
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>Welcome, {userData.name}!</Text>
          <Text style={styles.userInfoText}>ID: {userData.id}</Text>
          <Text style={styles.userInfoText}>Email: {userData.email}</Text>
          <Text style={styles.userInfoText}>Room ID: {userData.roomid || 'No room assigned'}</Text>
        </View>
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
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#50E3C2',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  userInfoContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  userInfoText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
  },
});