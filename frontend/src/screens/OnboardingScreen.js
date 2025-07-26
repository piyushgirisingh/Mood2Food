import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, SafeAreaView, TouchableOpacity, StyleSheet, Linking } from 'react-native';

export default function OnboardingScreen({ navigation }) {
  const [nickname, setNickname] = useState('');
  const [recoveryGoal, setRecoveryGoal] = useState('');

  const handleSubmit = () => {
    // Save user data (in real app, you'd use async storage or backend)
    const userData = {
      nickname: nickname.trim(),
      recoveryGoal: recoveryGoal.trim()
    };
    
    // Navigate to main app screen
    navigation.replace('Home', { userData });
  };

  const openNEDAWebsite = () => {
    Linking.openURL('https://www.nationaleatingdisorders.org/help-support/contact-helpline');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Welcome to RecoveryPath</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Your Nickname</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Alex"
            value={nickname}
            onChangeText={setNickname}
            autoCapitalize="words"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Your Recovery Goal</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="e.g. Reduce stress eating, Build healthy habits..."
            value={recoveryGoal}
            onChangeText={setRecoveryGoal}
            multiline
            numberOfLines={3}
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Begin Your Journey" 
            onPress={handleSubmit} 
            disabled={!nickname.trim() || !recoveryGoal.trim()}
            color="#4CAF50"
          />
        </View>
        
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerHeading}>Important Notice</Text>
          <Text style={styles.disclaimerText}>
            This app is not a replacement for professional medical care, 
            diagnosis, or treatment. Always seek the advice of your physician 
            or qualified health provider with any questions you may have.
          </Text>
          
          <TouchableOpacity 
            style={styles.helplineButton}
            onPress={openNEDAWebsite}
          >
            <Text style={styles.helplineText}>NEDA Helpline & Resources</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#2C3E50'
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
    color: '#34495E'
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D6DBDF',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF'
  },
  multilineInput: {
    height: 100,
    paddingTop: 16,
    textAlignVertical: 'top'
  },
  buttonContainer: {
    marginVertical: 20,
    borderRadius: 10,
    overflow: 'hidden'
  },
  disclaimerBox: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFECB3'
  },
  disclaimerHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#E65100',
    textAlign: 'center'
  },
  disclaimerText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#5D4037',
    textAlign: 'center'
  },
  helplineButton: {
    marginTop: 20,
    padding: 14,
    backgroundColor: '#D32F2F',
    borderRadius: 8,
    alignItems: 'center'
  },
  helplineText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});