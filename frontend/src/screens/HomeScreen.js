import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Button } from 'react-native';

export default function HomeScreen({ route, navigation }) {
  const { userData } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome, {userData?.nickname || 'Friend'}!</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Recovery Goal</Text>
        <Text style={styles.goalText}>{userData?.recoveryGoal || 'No goal set'}</Text>
      </View>
      
      <Text style={styles.motivation}>
        You're taking an important step towards wellness. We're here to support you.
      </Text>
      <View style={{ marginVertical: 20 }}>
        <Button
          title="How do you feel?"
          onPress={() => navigation.navigate('Feelings')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F5F5F5'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#2C3E50'
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#34495E'
  },
  goalText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#5D6D7E'
  },
  motivation: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#7D3C98',
    lineHeight: 24,
    marginTop: 20
  }
});