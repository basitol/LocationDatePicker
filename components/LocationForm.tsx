import React from 'react';
import {View, TextInput, Text} from 'react-native';
import {SelectList} from 'react-native-dropdown-select-list';
import {useLocationDate} from '../context/LocationDateContext';
import {LocationData} from '../types';
import {styles} from '../app/styles';

export default function LocationForm(): JSX.Element | null {
  const {selectedService, locationData, setLocationData, errors, setErrors} =
    useLocationDate();

  if (selectedService !== 'residential') return null;

  const validateField = (field: string, value: string): string => {
    if (!value.trim()) {
      return `${field} is required`;
    }
    if (value.length < 3) {
      return `${field} must be at least 3 characters`;
    }
    return '';
  };

  const handleInputChange = (field: keyof LocationData, value: string) => {
    setLocationData(prev => ({...prev, [field]: value}));
    setErrors(prev => ({...prev, [field]: ''}));

    const error = validateField(field, value);
    if (error) {
      setErrors(prev => ({...prev, [field]: error}));
    }
  };

  const handleLocationUpdate = (field: keyof LocationData, value: string) => {
    setLocationData(prev => ({...prev, [field]: value}));

    // Clear subsequent fields when LGA changes
    if (field === 'lga') {
      setLocationData(prev => ({
        ...prev,
        lga: value,
        area: '',
        busStop: '',
        landmark: '',
      }));
      setErrors({
        area: '',
        busStop: '',
        landmark: '',
      });
    }
  };

  return (
    <View style={styles.formSection}>
      <Text style={styles.sectionTitle}>Where do you want the task done?</Text>

      <SelectList
        setSelected={(value: string) => handleLocationUpdate('lga', value)}
        data={[
          {key: '1', value: 'Ido'},
          {key: '2', value: 'Maryland'},
          {key: '3', value: 'Ikorodu'},
          {key: '4', value: 'Badagry'},
          {key: '5', value: 'Ikeja'},
        ]}
        save='value'
        placeholder='Select Local Government'
        boxStyles={styles.selectBox}
      />

      {locationData.lga && (
        <View style={[styles.inputContainer, styles.fadeIn]}>
          <TextInput
            style={[styles.input, errors.area ? styles.inputError : null]}
            placeholder='Enter your house address'
            value={locationData.area}
            onChangeText={value => handleInputChange('area', value)}
            placeholderTextColor='#666'
          />
          {errors.area ? (
            <Text style={styles.errorText}>{errors.area}</Text>
          ) : null}
        </View>
      )}

      {locationData.lga &&
        locationData.area.trim().length >= 3 &&
        !errors.area && (
          <View style={[styles.inputContainer, styles.fadeIn]}>
            <TextInput
              style={[styles.input, errors.busStop ? styles.inputError : null]}
              placeholder='Enter closest bus stop'
              value={locationData.busStop}
              onChangeText={value => handleInputChange('busStop', value)}
              placeholderTextColor='#666'
            />
            {errors.busStop ? (
              <Text style={styles.errorText}>{errors.busStop}</Text>
            ) : null}
          </View>
        )}

      {locationData.lga &&
        locationData.area.trim().length >= 3 &&
        locationData.busStop.trim().length >= 3 &&
        !errors.area &&
        !errors.busStop && (
          <View style={[styles.inputContainer, styles.fadeIn]}>
            <TextInput
              style={[styles.input, errors.landmark ? styles.inputError : null]}
              placeholder='Enter nearby landmark'
              value={locationData.landmark}
              onChangeText={value => handleInputChange('landmark', value)}
              placeholderTextColor='#666'
            />
            {errors.landmark ? (
              <Text style={styles.errorText}>{errors.landmark}</Text>
            ) : null}
          </View>
        )}
    </View>
  );
}
