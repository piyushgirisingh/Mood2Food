import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

export default function FeelingsScreen({ navigation }) {
  const [textFeel, setTextFeel] = useState('');
  const [recording, setRecording] = useState(null);
  const [recordedUri, setRecordedUri] = useState(null);

  useEffect(() => {
    return recording
      ? () => {
          recording.stopAndUnloadAsync();
        }
      : undefined;
  }, [recording]);

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        console.warn('Permission to access microphone is required!');
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordedUri(uri);
      setRecording(null);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  }

  const handleSubmit = () => {
    const data = { text: textFeel, audioUri: recordedUri };
    console.log('Feeling submitted', data);
    // You can send this data to backend via your API client
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>How do you feel?</Text>
      <TextInput
        style={styles.input}
        placeholder="Type how you feel..."
        value={textFeel}
        onChangeText={setTextFeel}
      />
      {recording ? (
        <Button title="Stop Recording" onPress={stopRecording} color="#d9534f" />
      ) : (
        <Button title="Start Recording" onPress={startRecording} />
      )}
      {recordedUri && <Text style={styles.uriText}>Recorded: {recordedUri}</Text>}
      <View style={styles.submitButton}>
        <Button
          title="Submit"
          onPress={handleSubmit}
          disabled={!textFeel && !recordedUri}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  uriText: {
    marginTop: 10,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 30,
  },
});
