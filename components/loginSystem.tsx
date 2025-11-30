import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useState } from 'react';
import {
    Keyboard,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { styles } from '../app/domisStyles';
import { UserContext } from '../app/userContext';

const AUTH_STORAGE_KEY = 'loggedInUser';

const LoginSystem: React.FC = () => {
    const {soloUser, duoUsers, setSoloUser, setDuoUsers } = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loggingInSecondUser, setLoggingInSecondUser] = useState(false);

    const handleLogin = async () => {
    if (!username || !password) {
      alert('Please enter username and password');
      return;
    }

    try {
        const res = await fetch('http://5.161.204.169:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        if (!loggingInSecondUser) {
            if (duoUsers) setDuoUsers(null);

            setSoloUser({ UserID: data.UserID, Username: data.Username });

            await AsyncStorage.setItem(
                AUTH_STORAGE_KEY,
                JSON.stringify({ soloUser: { UserID: data.UserID, Username: data.Username } })
            );

            alert(`Logged in as ${data.Username}`);
            setUsername('');
            setPassword('');
        } else {
            if (!soloUser) {
                alert('You must login first as user 1 to add second user');
                return;
            }

            if (data.UserID === soloUser.UserID) {
                alert('This user is already logged in as User 1');
                return;
            }

            const newDuoUsers = [soloUser, { UserID: data.UserID, Username: data.Username }];
            setDuoUsers(newDuoUsers);
            setSoloUser(null);
            setLoggingInSecondUser(false);

            await AsyncStorage.setItem(
                AUTH_STORAGE_KEY,
                JSON.stringify({ duoUsers: newDuoUsers })
            );

            alert(`Duo mode activated with ${soloUser.Username} & ${data.Username}`);
            setUsername('');
            setPassword('');
        }
        } catch {
            alert('Login failed');
        }
    };

    const handleLogoutUser1 = async () => {
        if (duoUsers) {
            setSoloUser(duoUsers[1]);
            setDuoUsers(null);
            await AsyncStorage.setItem(
                AUTH_STORAGE_KEY,
                JSON.stringify({ soloUser: duoUsers[1] })
            );
        } else {
            setSoloUser(null);
            await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
        }
    };

    const handleLogoutUser2 = async () => {
        if (duoUsers) {
            setSoloUser(duoUsers[0]);
            setDuoUsers(null);
            await AsyncStorage.setItem(
                AUTH_STORAGE_KEY,
                JSON.stringify({ soloUser: duoUsers[0] })
            );
        }
    };

    const handleDeleteLocalData = async () => {
        setSoloUser(null);
        setDuoUsers(null);
        try {
            await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
            alert('Local user data deleted!');
        } catch (e) {
            alert('Failed to delete local data');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.centeredContainer}>
                {soloUser && !duoUsers && (
                    <>
                    <Text style={styles.loggedInText}>Logged in as {soloUser.Username}</Text>
                    {!loggingInSecondUser && (
                        <>
                        <TouchableOpacity style={styles.buttonPrimary} onPress={() => setLoggingInSecondUser(true)}>
                            <Text style={styles.buttonPrimaryText}>Add Second User (Duo Mode)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.buttonDanger, { marginTop: 10 }]} onPress={handleLogoutUser1}>
                            <Text style={styles.buttonDangerText}>Logout {soloUser.Username}</Text>
                        </TouchableOpacity>
                        </>
                    )}
                    </>
                )}
        
                {duoUsers && (
                    <>
                    <Text style={styles.loggedInText}>
                        Duo logged in as {duoUsers[0].Username} & {duoUsers[1].Username}
                    </Text>
                    <TouchableOpacity style={styles.buttonDanger} onPress={handleLogoutUser1}>
                        <Text style={styles.buttonDangerText}>Logout {duoUsers[0].Username}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.buttonDanger, { marginTop: 10 }]} onPress={handleLogoutUser2}>
                        <Text style={styles.buttonDangerText}>Logout {duoUsers[1].Username}</Text>
                    </TouchableOpacity>
                    </>
                )}
        
                {(loggingInSecondUser || (!soloUser && !duoUsers)) && (
                    <>
                    <TextInput
                        style={styles.input}
                        onChangeText={setUsername}
                        placeholder="Username"
                        placeholderTextColor="#555"
                        value={username}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={setPassword}
                        placeholder="Password"
                        placeholderTextColor="#555"
                        value={password}
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogin}>
                        <Text style={styles.buttonPrimaryText}>{loggingInSecondUser ? 'Login as User 2' : 'Login'}</Text>
                    </TouchableOpacity>
                    {loggingInSecondUser && (
                        <TouchableOpacity style={styles.buttonDanger} onPress={() => setLoggingInSecondUser(false)}>
                        <Text style={styles.buttonDangerText}>Cancel Duo Login</Text>
                        </TouchableOpacity>
                    )}
                    </>
                )}
        
                {/* Delete Local Data Button */}
                <TouchableOpacity
                    style={[styles.buttonDanger, { marginTop: 20 }]}
                    onPress={handleDeleteLocalData}
                >
                    <Text style={styles.buttonDangerText}>Delete Local User Data</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    )
};

export default LoginSystem;