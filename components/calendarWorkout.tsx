import { DateTime } from 'luxon';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../app/domisStyles';
import { UserContext } from '../app/userContext';

// Colors for 0, 1, 2+ users logged
const COLORS = {
  0: 'transparent',
  1: '#4a90e2',     // Blue for 1 user
  2: '#f05a28',     // Orange for 2 or more users
};

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface WorkoutLog {
  LogID: number;
  UserID: number;
  WorkoutName: string;
  WeightSet1: number | null;
  RepsSet1: number | null;
  WeightSet2: number | null;
  RepsSet2: number | null;
  WeightSet3: number | null;
  RepsSet3: number | null;
  DateTime: string;
}

const CalendarWorkout: React.FC = () => {
  const { soloUser, duoUsers } = useContext(UserContext);
  const [workoutData, setWorkoutData] = useState<Record<string, number>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [workoutsForDate, setWorkoutsForDate] = useState<WorkoutLog[]>([]);
  const [loadingWorkouts, setLoadingWorkouts] = useState(false);

  const today = DateTime.now().setZone('America/New_York');
  const year = today.year;
  const month = today.month;

  // Memoize userIds to prevent infinite loops
  const userIds = useMemo(() => {
    if (duoUsers) return [duoUsers[0].UserID, duoUsers[1].UserID];
    else if (soloUser) return [soloUser.UserID];
    else return [];
  }, [soloUser, duoUsers]);

  // Map userId to username for showing in popup
  const userIdToName = useMemo(() => {
    const map = new Map<number, string>();
    if (soloUser) map.set(soloUser.UserID, soloUser.Username);
    if (duoUsers) {
      map.set(duoUsers[0].UserID, duoUsers[0].Username);
      map.set(duoUsers[1].UserID, duoUsers[1].Username);
    }
    return map;
  }, [soloUser, duoUsers]);

  useEffect(() => {
    if (userIds.length === 0) {
      setWorkoutData({});
      return;
    }

    fetch(
      `http://5.161.204.169:3000/workoutCalendar/${year}/${month}/${userIds.join(',')}`
    )
      .then(res => res.json())
      .then(data => {
        setWorkoutData(data);
      })
      .catch(() => setWorkoutData({}));
  }, [year, month, userIds]);

  const daysInMonth = today.daysInMonth;
  const firstDayWeekday = DateTime.fromObject({ year, month, day: 1 }).weekday % 7; // Sunday=0..Saturday=6

  const leadingBlanks = firstDayWeekday;
  const blankCells = Array.from({ length: leadingBlanks }, (_, i) => i);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalCells = blankCells.length + daysArray.length;
  const trailingBlanks = (7 - (totalCells % 7)) % 7;
  const trailingBlankCells = Array.from({ length: trailingBlanks }, (_, i) => i);

  useEffect(() => {
    if (!selectedDate) {
      setWorkoutsForDate([]);
      setLoadingWorkouts(false);
      return;
    }

    if (userIds.length === 0) {
      setWorkoutsForDate([]);
      setLoadingWorkouts(false);
      return;
    }

    setLoadingWorkouts(true);
    Promise.all(
      userIds.map(userId =>
        fetch(`http://5.161.204.169:3000/individual_workouts/${userId}?date=${selectedDate}`)
          .then(res => (res.ok ? res.json() : []))
          .catch(() => [])
      )
    ).then(results => {
      const combined: WorkoutLog[] = results.flat();
      setWorkoutsForDate(combined);
      setLoadingWorkouts(false);
    });
  }, [selectedDate, userIds]);

  return (
    <View style={{ marginTop: 20, flex: 1 }}>
      <Text style={styles.sectionTitle}>
        Workout Calendar - {today.toFormat('MMMM yyyy')}
      </Text>

      {/* Weekday labels */}
      <View style={{ flexDirection: 'row', marginBottom: 4 }}>
        {WEEKDAY_LABELS.map(dayLabel => (
          <View
            key={dayLabel}
            style={{
              width: '13.6%',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontWeight: 'bold', color: '#555' }}>{dayLabel}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {/* Leading blanks */}
        {blankCells.map(i => (
          <View
            key={`blank-leading-${i}`}
            style={{
              width: '13.6%',
              aspectRatio: 1,
              margin: 1,
            }}
          />
        ))}

        {/* Days */}
        {daysArray.map(day => {
          const dateStr = DateTime.fromObject({ year, month, day })
            .toISODate();

          const usersLogged = workoutData[dateStr] || 0;
          const backgroundColor =
            usersLogged === 0 ? COLORS[0] : usersLogged >= 2 ? COLORS[2] : COLORS[1];

          return (
            <TouchableOpacity
              key={dateStr}
              style={{
                width: '13.6%',
                aspectRatio: 1,
                margin: 1,
                backgroundColor,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 6,
                borderWidth: 1,
                borderColor: '#ccc',
              }}
              onPress={() => setSelectedDate(dateStr)}
            >
              <Text style={{ color: usersLogged === 0 ? '#999' : '#fff' }}>{day}</Text>
            </TouchableOpacity>
          );
        })}

        {/* Trailing blanks */}
        {trailingBlankCells.map(i => (
          <View
            key={`blank-trailing-${i}`}
            style={{
              width: '13.6%',
              aspectRatio: 1,
              margin: 1,
            }}
          />
        ))}
      </View>

      <Modal
        visible={selectedDate !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedDate(null)}
      >
        <Pressable
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}
          onPress={() => setSelectedDate(null)}
        >
          <View
            style={{
              backgroundColor: '#fff',
              padding: 20,
              borderRadius: 10,
              maxHeight: '70%',
              minWidth: 300,
              alignItems: 'center',
            }}
          >
            <Text style={{ marginBottom: 10, fontWeight: 'bold', fontSize: 16 }}>
              Workouts on {selectedDate}
            </Text>

            {loadingWorkouts ? (
              <Text>Loading...</Text>
            ) : workoutsForDate.length === 0 ? (
              <Text>No workouts found.</Text>
            ) : (
              <ScrollView style={{ width: '100%' }}>
                {workoutsForDate.map(workout => (
                  <View
                    key={workout.LogID}
                    style={{
                      marginBottom: 12,
                      padding: 10,
                      borderWidth: 1,
                      borderColor: '#ccc',
                      borderRadius: 6,
                      backgroundColor: '#fafafa',
                    }}
                  >
                    <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>
                      {workout.WorkoutName} ({userIdToName.get(workout.UserID) ?? 'Unknown'})
                    </Text>
                    <Text>Reps: {workout.RepsSet1 ?? '-'}, {workout.RepsSet2 ?? '-'}, {workout.RepsSet3 ?? '-'}</Text>
                    <Text>Weight: {workout.WeightSet1 ?? '-'} lbs, {workout.WeightSet2 ?? '-'} lbs, {workout.WeightSet3 ?? '-'} lbs</Text>
                  </View>
                ))}
              </ScrollView>
            )}

            <Pressable
              onPress={() => setSelectedDate(null)}
              style={{
                marginTop: 15,
                paddingVertical: 8,
                paddingHorizontal: 20,
                backgroundColor: '#4a90e2',
                borderRadius: 6,
              }}
            >
              <Text style={{ color: '#fff' }}>Close</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default CalendarWorkout;
