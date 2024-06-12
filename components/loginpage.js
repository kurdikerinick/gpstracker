import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { db } from '../firebase';
import { ref, orderByChild, equalTo, get, query } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const navigation = useNavigation();

  const handleLogin = () => {
    matchStudent(email, studentNumber);
  };

  const matchStudent = async (email, studentNumber) => {
    try {
      const studentsRef = ref(db, 'students');
      const studentsQuery = query(studentsRef, orderByChild('email'), equalTo(email));

      const snapshot = await get(studentsQuery);
      if (snapshot.exists()) {
        let matchFound = false;
        snapshot.forEach((childSnapshot) => {
          const student = childSnapshot.val();
          if (student.studentNumber === studentNumber) {
            matchFound = true;
            console.log('Match found:', student);
            navigation.navigate('home', { routeId: student.routeId, routeName: student.routeName });
          }
        });
        if (!matchFound) {
          setErrorMessage('Student number does not match the provided email');
        }
      } else {
        setErrorMessage('No matching student found with the provided email');
      }
    } catch (error) {
      console.error('Error matching student:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Login</Text>
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Student Number"
        onChangeText={setStudentNumber}
        value={studentNumber}
        keyboardType="numeric"
      />
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'black',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default LoginScreen;
