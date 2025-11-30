import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import CalendarWorkout from '../../components/calendarWorkout';
import ProgressGraph from '../../components/progressGraph';
import { styles } from '../domisStyles';

const WorkoutsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 16 }}>
        <CalendarWorkout />
        <ProgressGraph />
        <View style={{ height:'15%'}} /> 
      </View>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  centeredContainer: {
    justifyContent: 'center',      // centers children vertically
    paddingHorizontal: 10,
  },
});

export default WorkoutsScreen;
