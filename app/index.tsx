import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from 'expo-router';
import {LocationDateProvider} from '../context/LocationDateContext';
import {styles} from './styles';
import ServiceSelection from '../components/ServiceSelection';
import LocationForm from '../components/LocationForm';
import DateTimeSelection from '../components/DateTimeSelection';
import ContinueButton from '../components/ContinueButton';

export default function LocationDateScreen() {
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({headerShown: false});
  }, [navigation]);
  return (
    <LocationDateProvider>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container}>
          <ServiceSelection />
          <LocationForm />
          <DateTimeSelection />
          <ContinueButton />
        </ScrollView>
      </SafeAreaView>
    </LocationDateProvider>
  );
}
