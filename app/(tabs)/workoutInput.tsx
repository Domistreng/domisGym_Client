import React from 'react';
import {
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import WorkoutLogInput from '../../components/workoutLogInput';


const WorkoutInputScreen: React.FC = () => {
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <WorkoutLogInput/>
    </TouchableWithoutFeedback>
  );
};

export default WorkoutInputScreen;
