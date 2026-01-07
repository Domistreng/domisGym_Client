import React, { useState } from 'react';
// import { styles } from '../app/domisStyles';
import {
    Modal,
    Pressable,
    Text,
    View
} from 'react-native';


interface WorkoutLog {
  LogID: number;
  UserID: number;
  WorkoutName: string;
  WeightSet1: number | null;
  WeightSet2: number | null;
  WeightSet3: number | null;
  RepsSet1: number | null;
  RepsSet2: number | null;
  RepsSet3: number | null;
  DateTime: string | null;
}

type LoadIdProps = {
  log: WorkoutLog | null,
  username: string | undefined
  reloadFun: () => void;
};

const InputRecentHistory: React.FC<LoadIdProps> = ({log, username, reloadFun}) => {
    const [visiblePopup, setVisiblePopup] = useState(false);

    const deleteWorkout = (userId: number | undefined, dateTime: string | null, logId: number | undefined) => {
        let payload = {
            userId: userId,
            dateTime: dateTime,
            logId: logId
        }

        fetch(`http://5.161.204.169:3000/deleteWorkout/${payload.userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })

        setVisiblePopup(false)
        reloadFun();
    }

    const handlePopupPress = () => {
        setVisiblePopup(true);
    };
    
    if (!log || !username) return null;
        return (
            <View>
                <Pressable onPress={handlePopupPress}>
                    <View style={{ marginTop: 15, padding: 10, backgroundColor: '#eee', borderRadius: 6 }}>
                        <Text style={{ fontWeight: '700', fontSize: 18, marginBottom: 6 }}>{username}: {log.WorkoutName}</Text>
                        <Text>Reps: {log.RepsSet1 ?? '-'}, {log.RepsSet2 ?? '-'}, {log.RepsSet3 ?? '-'}</Text>
                        <Text>Weight (lbs): {log.WeightSet1 ?? '-'}, {log.WeightSet2 ?? '-'}, {log.WeightSet3 ?? '-'}</Text>
                    </View>
                </Pressable>

                <Modal
                    visible = {visiblePopup}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setVisiblePopup(false)}
                >
                    <View
                        style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.4)', // dim background
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: '#fff',
                                padding: 20,
                                borderRadius: 10,
                                maxHeight: '70%',
                                minWidth: 300,
                                alignItems: 'center',
                                justifyContent: 'center',
                                
                            }}
                        >
                            <Text>Details: {log.RepsSet1}</Text>
                            <Text>Date: {log.DateTime}</Text>
                            <Pressable
                                style={{
                                    marginTop: 15,
                                    paddingVertical: 8,
                                    paddingHorizontal: 20,
                                    backgroundColor: '#4a90e2',
                                    borderRadius: 6,
                                }}
                                onPress={() => setVisiblePopup(false)}
                            >
                                <Text style={{ color: '#fff' }}>Close</Text>
                            </Pressable>

                            <Pressable
                                style={{
                                    marginTop: 15,
                                    paddingVertical: 8,
                                    paddingHorizontal: 20,
                                    backgroundColor: '#930633ff',
                                    borderRadius: 6,
                                }}
                                onPress={() => deleteWorkout(log.UserID, log.DateTime, log.LogID)}
                            >
                                <Text style={{ color: '#fff' }}>Delete Log</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </View>
        );
}

export default InputRecentHistory