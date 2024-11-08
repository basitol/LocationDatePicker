import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {useLocationDate} from '../context/LocationDateContext';
import {styles} from '../app/styles';

export default function ContinueButton(): JSX.Element {
  const {
    selectedService,
    locationData,
    dateType,
    selectedDate,
    needTimeOfDay,
    selectedTimeSlot,
    errors,
    setErrors,
  } = useLocationDate();

  const isContinueEnabled = (): boolean => {
    if (selectedService === 'onsite') {
      if (dateType === 'fixed') {
        return Boolean(selectedDate && (!needTimeOfDay || selectedTimeSlot));
      }
      return dateType === 'flexible';
    }

    if (selectedService === 'residential') {
      const isLocationComplete =
        locationData.lga !== '' &&
        locationData.area.trim() !== '' &&
        locationData.busStop.trim() !== '' &&
        locationData.landmark.trim() !== '';
      const noErrors = Object.values(errors).every(error => !error);

      if (!isLocationComplete || !noErrors) return false;

      if (dateType === 'fixed') {
        return Boolean(selectedDate && (!needTimeOfDay || selectedTimeSlot));
      }
      return dateType === 'flexible';
    }

    return false;
  };

  const handleContinue = () => {
    // Validate all fields before continuing
    const validateField = (field: string, value: string): string => {
      if (!value.trim()) {
        return `${field} is required`;
      }
      if (value.length < 3) {
        return `${field} must be at least 3 characters`;
      }
      return '';
    };

    const newErrors = {
      area: validateField('House Address', locationData.area),
      busStop: validateField('Bus Stop', locationData.busStop),
      landmark: validateField('Landmark', locationData.landmark),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }

    console.log('Form submitted:', {
      selectedService,
      locationData,
      dateType,
      selectedDate,
      needTimeOfDay,
      selectedTimeSlot,
    });
  };

  return (
    <TouchableOpacity
      style={[
        styles.continueButton,
        !isContinueEnabled() && styles.continueButtonDisabled,
      ]}
      onPress={handleContinue}
      disabled={!isContinueEnabled()}>
      <Text style={styles.continueButtonText}>Continue</Text>
    </TouchableOpacity>
  );
}
