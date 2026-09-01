import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { styles } from '../domisStyles';
import { UserContext } from '../userContext';

interface WorkoutOption {
  label: string;
  value: string;
  workoutDay: string;
}

interface GroupOption {
  label: string;
  value: string;
}


const WorkoutsScreen: React.FC = () => {

    const { soloUser, duoUsers } = useContext(UserContext);
    const [reload, setReload] = useState(false)
    const [updatedWorkout, setUpdatedWorkout] = useState<WorkoutOption>({label: '...', value: '...', workoutDay: '...'});
    const [workouts, setWorkouts] = useState<WorkoutOption[]>([]);
    const [groups, setGroups] = useState<GroupOption[]>([]);
    const [workouts_open, workouts_setOpen] = useState(false);
    const [groups_open, groups_setOpen] = useState(false)
    const [selectedWorkout, setSelectedWorkout] = useState<string | undefined>(undefined);
    const [selectedGroup, setSelectedGroup] = useState<string | undefined>(undefined);

    useEffect(() => {
        const userId = duoUsers ? duoUsers[0].UserID : soloUser?.UserID;
        if (!userId) return;
        fetch(`http://5.161.204.169:3000/workouts_list/${userId}`)
            .then((res) => res.json())
            .then((data: { WorkoutName: string, MuscleGroup: string}[]) => {
                const converted = data.map((w) => ({ label: w.WorkoutName, value: w.WorkoutName, workoutDay: w.MuscleGroup}));
                setWorkouts(converted);

                let tempGroups: string[] = []
                for (let i in converted) {
                    if (!(tempGroups.includes(converted[i].workoutDay))) {
                        tempGroups.push(converted[i].workoutDay)
                    }
                    const groupSetting = tempGroups.map((w) => ({ label:w, value:w}))
                    setGroups(groupSetting)
                }
            })
            .catch(() => {
                setWorkouts([]);
                setSelectedWorkout(null);
            });
    }, [soloUser, duoUsers, reload]);
    

    const endEditingItemName = (e) => {
        const finalValue = e.nativeEvent.text;
        setUpdatedWorkout({label: finalValue, value: finalValue, workoutDay: updatedWorkout.workoutDay})
    } ;

    const updateWorkout = () => {
        const userId = duoUsers ? duoUsers[0].UserID : soloUser?.UserID;
        if (!userId) return;
        fetch(`http://5.161.204.169:3000/createWorkout/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedWorkout),
        })

        
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1, flexDirection: 'column'}}>
                <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row'}}>
                    <View style={{ flex: 1}}>
                        <DropDownPicker
                            open={workouts_open}
                            value={selectedWorkout}
                            items={workouts}
                            setOpen={workouts_setOpen}
                            setValue={setSelectedWorkout}
                            setItems={setWorkouts}
                            containerStyle={{ marginBottom: 15, zIndex: 5000 }}
                            style={styles.dropDownStyle}
                            dropDownContainerStyle={styles.dropDownContainer}
                            onSelectItem={(thisWorkout) => {setUpdatedWorkout(thisWorkout); setSelectedGroup(thisWorkout.workoutDay)}}
                            textStyle={styles.dropDownText}
                        />
                    </View>
                    <TouchableOpacity style={styles.buttonPrimary} onPress={() => updateWorkout()}>
                        <Text style={styles.buttonPrimaryText}>Create New</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 8, justifyContent: 'center', flexDirection: 'column'}}>
                    <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row'}}>
                        <Text>Name:</Text>
                        <TextInput 
                            style={styles.textInput}
                            defaultValue={updatedWorkout.label}
                            onEndEditing={endEditingItemName}>
                        </TextInput>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row'}}>
                        <Text>Group:</Text>
                        <View style={{ flex: 1}}>
                            <DropDownPicker
                                open={groups_open}
                                value={selectedGroup}
                                items={groups}
                                setOpen={groups_setOpen}
                                setValue={setSelectedGroup}
                                setItems={setGroups}
                                containerStyle={{ marginBottom: 15, zIndex: 5000 }}
                                style={styles.dropDownStyle}
                                dropDownContainerStyle={styles.dropDownContainer}
                                onSelectItem={(thisWorkout) => setUpdatedWorkout({value: updatedWorkout.value, label: updatedWorkout.label, workoutDay: thisWorkout.workoutDay})}
                                textStyle={styles.dropDownText}
                            />
                        </View>
                    </View>
                    <TouchableOpacity style={styles.buttonPrimary} onPress={() => console.log('test2')}>
                        <Text style={styles.buttonPrimaryText}>Update</Text>
                    </TouchableOpacity>
                    
                </View>
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
