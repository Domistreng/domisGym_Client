//#region Headwork
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import React, { useContext, useEffect, useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { styles } from '../app/domisStyles';
import { UserContext } from '../app/userContext';
import InputRecentHistory from '../components/inputRecentHistory';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,      // show banner/alert even in foreground
    shouldPlaySound: true,      // play sound
    shouldSetBadge: false,      // update app icon badge if you want
  }),
});

interface WorkoutOption {
  label: string;
  value: string;
}
interface WeightsReps {
  WeightSet1: string;
  WeightSet2: string;
  WeightSet3: string;
  RepsSet1: string;
  RepsSet2: string;
  RepsSet3: string;
}
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
//#endregion

const WorkoutLoginInput: React.FC = () => {
    //#region alarms
    async function registerForPushLikePermissions() {
        if (!Device.isDevice) return;

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            throw new Error('Notification permission not granted');
        }
    }

    async function startAlarm(durationSeconds: number) {
        const seconds = durationSeconds;

        const id = await Notifications.scheduleNotificationAsync({
            content: {
            title: "Alarm",
            body: "Workout",
            sound: 'default', // make sure proper sound is configured
            },
            trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds,
            repeats: false,
            channelId: Platform.OS === 'android' ? 'alarm' : undefined,
            },
        });

        // Store `id` if you want to cancel later
        return id;
    }

    async function cancelAlarm(alarmNotificationId: string | null) {
        if (!alarmNotificationId) return;

        await Notifications.cancelScheduledNotificationAsync(alarmNotificationId);
    }
    //#endregion
    //#region Definitions
    const { soloUser, duoUsers } = useContext(UserContext);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string | null>(null);
    const [items, setItems] = useState<WorkoutOption[]>([]);
    const [timerA, setTimerA] = useState<number | 0>(-1);
    const [timeStartA, setTimeStartA] = useState<number | 0>(-1)
    const [alarmA, setAlarmA] = useState<string | null>(null);
    const [timerB, setTimerB] = useState<number | 0>(-1);
    const [timeStartB, setTimeStartB] = useState<number | 0>(-1)
    const [alarmB, setAlarmB] = useState<string | null>(null);

    const [inputs1, setInputs1] = useState<WeightsReps>({
        WeightSet1: '',
        WeightSet2: '',
        WeightSet3: '',
        RepsSet1: '',
        RepsSet2: '',
        RepsSet3: '',
    });
    const [inputs2, setInputs2] = useState<WeightsReps>({
        WeightSet1: '',
        WeightSet2: '',
        WeightSet3: '',
        RepsSet1: '',
        RepsSet2: '',
        RepsSet3: '',
    });

    const activeUser1 = duoUsers ? duoUsers[0] : soloUser;
    const activeUser2 = duoUsers ? duoUsers[1] : null;

    const secondsBeforeWorkout = 5;

    // State for latest logs per user for selected workout
    const [latestLogUser1, setLatestLogUser1] = useState<WorkoutLog | null>(null);
    const [latestLogUser2, setLatestLogUser2] = useState<WorkoutLog | null>(null);
    //#endregion

    //#region useEffects
    useEffect(() => {
        const userId = duoUsers ? duoUsers[0].UserID : soloUser?.UserID;
        if (!userId) return;
        fetch(`http://5.161.204.169:3000/workouts_by_day/${userId}`)
            .then((res) => res.json())
            .then((data: { WorkoutName: string }[]) => {
                const converted = data.map((w) => ({ label: w.WorkoutName, value: w.WorkoutName }));
                setItems(converted);
                if (converted.length) setValue(converted[0].value);
            })
            .catch(() => {
                setItems([]);
                setValue(null);
            });
    }, [soloUser, duoUsers]);

    useEffect(() => {
        registerForPushLikePermissions()
    });

    useEffect(() => {
        fetchLatestLogForUser(activeUser1?.UserID, value, setLatestLogUser1);
    }, [activeUser1, value]);

    useEffect(() => {
        if (activeUser2) {
            fetchLatestLogForUser(activeUser2.UserID, value, setLatestLogUser2);
        } else {
            setLatestLogUser2(null);
        }
    }, [activeUser2, value]);

    // timer A
    useEffect(() => {
        if (timerA === -1) return; // not running

        const id = setInterval(() => {
            setTimerA(Math.floor(Date.now() / 1000) - timeStartA);  // use functional update
        }, 1000);

        return () => clearInterval(id); // cleanup on timerA change/unmount
    }, [timerA]);

    // timer B
    useEffect(() => {
        if (timerB === -1) return;

        const id = setInterval(() => {
            setTimerB(Math.floor(Date.now() / 1000) - timeStartB);
        }, 1000);

        return () => clearInterval(id);
    }, [timerB]);

    //#endregion

    //#region functions (related with API)
    

    const handleSubmit = () => {
        if (!value) return alert('Please select a workout');
        if (!activeUser1) return alert('User not logged in');

        setTimerA(-1);
        setTimerB(-1);

        const allInputsBlank = (inputs: WeightsReps) =>
            !inputs.WeightSet1 &&
            !inputs.WeightSet2 &&
            !inputs.WeightSet3 &&
            !inputs.RepsSet1 &&
            !inputs.RepsSet2 &&
            !inputs.RepsSet3;

        const payloads = [];
        if (!allInputsBlank(inputs1)) {
            payloads.push({
                UserID: activeUser1.UserID,
                WorkoutName: value,
                WeightSet1: parseNumberOrNull(inputs1.WeightSet1),
                RepsSet1: parseNumberOrNull(inputs1.RepsSet1),
                WeightSet2: parseNumberOrNull(inputs1.WeightSet2),
                RepsSet2: parseNumberOrNull(inputs1.RepsSet2),
                WeightSet3: parseNumberOrNull(inputs1.WeightSet3),
                RepsSet3: parseNumberOrNull(inputs1.RepsSet3),
            });
        }
        if (activeUser2 && !allInputsBlank(inputs2)) {
            payloads.push({
                UserID: activeUser2.UserID,
                WorkoutName: value,
                WeightSet1: parseNumberOrNull(inputs2.WeightSet1),
                RepsSet1: parseNumberOrNull(inputs2.RepsSet1),
                WeightSet2: parseNumberOrNull(inputs2.WeightSet2),
                RepsSet2: parseNumberOrNull(inputs2.RepsSet2),
                WeightSet3: parseNumberOrNull(inputs2.WeightSet3),
                RepsSet3: parseNumberOrNull(inputs2.RepsSet3),
            });
        }

        if (!payloads.length) return alert('Enter at least one field for a user');

        Promise.all(
            payloads.map((payload) =>
                fetch(`http://5.161.204.169:3000/individual_workouts/${payload.UserID}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                })
            )
        )
            .then(() => {
                alert('Workout log(s) added!');
                setInputs1({
                    WeightSet1: '',
                    WeightSet2: '',
                    WeightSet3: '',
                    RepsSet1: '',
                    RepsSet2: '',
                    RepsSet3: '',
                });
                setInputs2({
                    WeightSet1: '',
                    WeightSet2: '',
                    WeightSet3: '',
                    RepsSet1: '',
                    RepsSet2: '',
                    RepsSet3: '',
                });
                fetchLatestLogForUser(activeUser1?.UserID, value, setLatestLogUser1);
                if (activeUser2) {
                    fetchLatestLogForUser(activeUser2.UserID, value, setLatestLogUser2);
                }
            })
            .catch(() => alert('Failed to add workout log(s)'));
    };
    // Function to fetch and set latest log for a user and workout
    const fetchLatestLogForUser = (userId: number | undefined, workoutName: string | null, setLog: React.Dispatch<React.SetStateAction<WorkoutLog | null>>) => {
        if (!userId || !workoutName) {
            setLog(null);
            return;
        }
        fetch(`http://5.161.204.169:3000/individual_workouts/${userId}`)
        .then((res) => res.json())
        .then((logs: WorkoutLog[]) => {
            const filteredLogs = logs.filter((log) => log.WorkoutName === workoutName);
            if (filteredLogs.length === 0) {
                setLog(null);
                return;
            }
            const latest = filteredLogs.reduce((prev, current) => (prev.LogID > current.LogID ? prev : current));
            setLog(latest);
        })
        .catch(() => {
            setLog(null);
         });
    };
    //#endregion
    
    //#region functions (non-API)

    const reloadUserLogs = () => {
        fetchLatestLogForUser(activeUser1?.UserID, value, setLatestLogUser1);
        if (activeUser2) {
            fetchLatestLogForUser(activeUser2.UserID, value, setLatestLogUser2);
        }
    }

    const parseNumberOrNull = (str: string) => {
        if (!str) return null;
        const n = Number(str.trim());
        return isNaN(n) ? null : n;
    };

    const handleChange = async (userNumber: 1 | 2, field: keyof WeightsReps, val: string) => {
        if (userNumber === 1) 
        {
            setInputs1((prev) => ({ ...prev, [field]: val }));
            setTimerA(0)
            setTimeStartA(Math.floor(Date.now() / 1000))
            cancelAlarm(alarmA)
            setAlarmA(await startAlarm(secondsBeforeWorkout))
        }
        else 
        {
            setInputs2((prev) => ({ ...prev, [field]: val }));
            setTimerB(0)
            setTimeStartB(Math.floor(Date.now() / 1000))
            cancelAlarm(alarmB)
            setAlarmB(await startAlarm(secondsBeforeWorkout))
        }
    };

    // Function to copy WeightSet1 value into WeightSet2 and WeightSet3 for a user
    const handleCopyWeightSet1 = (userNumber: 1 | 2) => {
        if (userNumber === 1) {
            const val = inputs1.WeightSet1;
            setInputs1((prev) => ({
                ...prev,
                WeightSet2: val,
                WeightSet3: val,
            }));
        } else {
            const val = inputs2.WeightSet1;
            setInputs2((prev) => ({
                ...prev,
                WeightSet2: val,
                WeightSet3: val,
            }));
        }
    };
    //#endregion

    //#region visual renders

    const renderInputRow = (userNumber: 1 | 2, label: string, keys: (keyof WeightsReps)[]) => {
        const inputs = userNumber === 1 ? inputs1 : inputs2;

        return (
            <>
                <Text style={styles.rowLabel}>{label}</Text>
                <View style={styles.row}>
                    {keys.map((key) => (
                        <View key={key} style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginHorizontal: 4 }}>
                            <TextInput
                                style={[styles.inputSmall, { flex: 1 }]}
                                keyboardType="numeric"
                                placeholder="0"
                                value={inputs[key]}
                                onChangeText={(text) => handleChange(userNumber, key, text)}
                                placeholderTextColor="#999"
                            />
                            {label.toLowerCase().startsWith('weight') && key === 'WeightSet1' && (
                                <TouchableOpacity
                                    onPress={() => handleCopyWeightSet1(userNumber)}
                                    style={{
                                        marginLeft: 6,
                                        paddingVertical: 6,
                                        paddingHorizontal: 10,
                                        backgroundColor: '#4a90e2',
                                        borderRadius: 4,
                                    }}
                                >
                                    <Text style={{ color: '#fff', fontWeight: '600' }}>→</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </View>
            </>
        );
    };

    const renderLatestLog = (log: WorkoutLog | null, username: string | undefined) => {
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
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 10 }}>
                        <Text style={styles.sectionTitle}>Select Workout</Text>
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
                        />

                        {activeUser1 && (
                            <>
                                {timerA != -1 && (<Text style={styles.duoLabel}>{activeUser1.Username} | {timerA}</Text>)}
                                {timerA == -1 && (<Text style={styles.duoLabel}>{activeUser1.Username}</Text>)}
                                {renderInputRow(1, 'Reps', ['RepsSet1', 'RepsSet2', 'RepsSet3'])}
                                {renderInputRow(1, 'Weight (lbs)', ['WeightSet1', 'WeightSet2', 'WeightSet3'])}
                            </>
                        )}

                        {activeUser2 && (
                            <>
                                {timerB != -1 && (<Text style={styles.duoLabel}>{activeUser2.Username} | {timerB}</Text>)}
                                {timerB == -1 && (<Text style={styles.duoLabel}>{activeUser2.Username}</Text>)}
                                {renderInputRow(2, 'Reps', ['RepsSet1', 'RepsSet2', 'RepsSet3'])}
                                {renderInputRow(2, 'Weight (lbs)', ['WeightSet1', 'WeightSet2', 'WeightSet3'])}
                            </>
                        )}

                        <TouchableOpacity style={styles.buttonPrimary} onPress={handleSubmit}>
                            <Text style={styles.buttonPrimaryText}>Add Workout Log</Text>
                        </TouchableOpacity>

                        {/* Latest logs display */}
                        <InputRecentHistory log={latestLogUser1} username={activeUser1?.Username} reloadFun={reloadUserLogs}/>
                        {activeUser2 && <InputRecentHistory log={latestLogUser2} username={activeUser2?.Username} reloadFun={reloadUserLogs}/>}
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
    //#endregion
};

export default WorkoutLoginInput;