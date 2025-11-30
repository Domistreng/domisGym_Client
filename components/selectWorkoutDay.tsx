//#region headwork
import React, { useContext, useState } from 'react';
import { styles } from '../app/domisStyles';


import {
    Text,
    View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { UserContext } from '../app/userContext';


type LoadIdProps = {
  
};
//#endregion
const SelectWorkoutDay: React.FC<LoadIdProps> = ({}) => {

    const { soloUser, duoUsers } = useContext(UserContext);
    const activeUser1 = duoUsers ? duoUsers[0] : soloUser;
    const activeUser2 = duoUsers ? duoUsers[1] : null;
    //HARD CODED FOR PPL SETTINGS
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string | null>(null);
    const [items, setItems] = useState([
        { label: 'Legs', value: 'Legs' },
        { label: 'Push', value: 'Push' },
        { label: 'Pull', value: 'Pull' },
        ]);

    const sendTodayWorkout = (newWorkout: string) => {
        const payloads = [];
        payloads.push({
            UserID: activeUser1.UserID,
            workoutSchedule: newWorkout})

        if (activeUser2) {
            payloads.push({
                UserID: activeUser2.UserID,
                workoutSchedule: newWorkout})
        }
        console.log('testing');
        Promise.all(
            payloads.map((payload) =>
                fetch(`http://5.161.204.169:3000/setWorkoutToday/${payload.UserID}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                })
            )
        )
    };

    
    return (
        <View>
            <Text style={styles.sectionTitle}>What workout today?</Text>
                <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    containerStyle={{ marginBottom: 15, zIndex: 5000 }}
                    style={styles.dropDownStyle}
                    dropDownContainerStyle={styles.dropDownContainer}
                    textStyle={styles.dropDownText}
                    onChangeValue={sendTodayWorkout}
                />
        </View>
    )
}

export default SelectWorkoutDay