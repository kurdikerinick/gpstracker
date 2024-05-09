import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { getDatabase, ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { db } from '../firebase.js';
import { getAuth, sendEmailVerification } from 'firebase/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const auth = getAuth();
      
      // Check if there's a currently logged-in user
      if (!auth.currentUser) {
        console.log('No user logged in');
        setError('No user logged in');
        return; // Prevent further execution
      }

      const studentsRef = ref(db, '/students');
      const queryRef = query(studentsRef, orderByChild('email'), equalTo(email));
      const snapshot = await get(queryRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        const userId = Object.keys(userData)[0];
        const user = userData[userId];

        // Check if the email is verified
        if (!auth.currentUser.emailVerified) {
          console.log('Email not verified');
          setError('Email not verified');
          return; // Prevent further execution
        }

        if (user.studentNumber === studentNumber) {
          console.log('Login successful');
          // Navigate to the desired screen upon successful login
        } else {
          console.log('Incorrect student number');
          setError('Incorrect student number');
        }
      } else {
        console.log('User not found');
        setError('User not found');
      }
    } catch (error) {
      console.error('Error logging in: ', error.message);
      setError('Error logging in');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Email Login</Text>
      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        style={styles.input}
      />
      <TextInput
        placeholder="Student Number"
        onChangeText={setStudentNumber}
        value={studentNumber}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});
