import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { styles } from '../domisStyles';
import { UserContext } from '../userContext';



const AUTH_STORAGE_KEY = 'loggedInUser';

const SettingsPage: React.FC = () => {
  const { soloUser, duoUsers, setSoloUser, setDuoUsers } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  // New state for workout streaks
  const [streakUser1, setStreakUser1] = useState<number | null>(null);
  const [streakUser2, setStreakUser2] = useState<number | null>(null);

  useEffect(() => {
    async function tryRestoreUser() {
      try {
        const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.duoUsers && Array.isArray(parsed.duoUsers) && parsed.duoUsers.length === 2) {
            setDuoUsers(parsed.duoUsers);
            setSoloUser(null);
          } else if (parsed.soloUser) {
            setSoloUser(parsed.soloUser);
            setDuoUsers(null);
          }
        }
      } catch (err) {
        console.warn('Failed to restore user:', err);
      }
      setLoading(false);
    }
    tryRestoreUser();
  }, [setSoloUser, setDuoUsers]);

  // Fetch streak for a single user by userId and update appropriate state setter
  const fetchStreak = async (userId: number, setStreak: React.Dispatch<React.SetStateAction<number | null>>) => {
    try {
      const response = await fetch(`http://5.161.204.169:3000/getWorkoutHistory/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setStreak(data.consecutiveDays ?? 0);
      } else {
        setStreak(0);
      }
    } catch (error) {
      console.warn('Failed to fetch streak:', error);
      setStreak(0);
    }
  };

  // Fetch streaks when users load or change
  useEffect(() => {
    if (duoUsers && duoUsers.length === 2) {
      fetchStreak(duoUsers[0].UserID, setStreakUser1);
      fetchStreak(duoUsers[1].UserID, setStreakUser2);
    } else if (soloUser) {
      fetchStreak(soloUser.UserID, setStreakUser1);
      setStreakUser2(null);
    } else {
      setStreakUser1(null);
      setStreakUser2(null);
    }
  }, [soloUser, duoUsers]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.centeredContainer}>
      <Text>In dev</Text>
    </View>
  );
};

export default SettingsPage;
