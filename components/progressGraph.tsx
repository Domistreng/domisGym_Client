import React, { useContext, useMemo } from 'react';
import { Dimensions, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { UserContext } from '../app/userContext';

const screenWidth = Dimensions.get('window').width;

const ProgressGraph: React.FC = () => {
  const { soloUser, duoUsers } = useContext(UserContext);

  // Get usernames, fallback to generic if missing
  const usernames = useMemo(() => {
    if (duoUsers) return [duoUsers[0].Username, duoUsers[1].Username];
    if (soloUser) return [soloUser.Username];
    return ['User1', 'User2'];
  }, [soloUser, duoUsers]);

  const data = {
    labels: Array.from({ length: 20 }, () => ''),
    datasets: [
      {
        data: Array.from({ length: 20 }, (_, i) => i / 19),
        color: () => '#4a90e2',
        strokeWidth: 2,
        label: usernames[0] || 'User1',
      },
      {
        data: Array.from({ length: 20 }, (_, i) => 1 - i / 19),
        color: () => '#f05a28',
        strokeWidth: 2,
        label: usernames[1] || 'User2',
      },
    ],
    legend: usernames.length === 1 ? [usernames[0]] : usernames,
  };

  return (
    <View style={{
      borderRadius: 12,
      padding: 10,
      marginTop: 20,
      backgroundColor: '#fff',
    }}>
      {/* <Text style={styles.sectionTitle}>Progress Graph</Text> */}
      <LineChart
        data={data}
        width={screenWidth - 64}
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: () => '#555',
          style: { borderRadius: 16 },
          propsForDots: { r: '4', strokeWidth: '2', stroke: '#fff' },
        }}
        bezier
        style={{ borderRadius: 12 }}
      />
    </View>
  );
};

export default ProgressGraph;
