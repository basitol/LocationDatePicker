import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {useLocationDate} from '../context/LocationDateContext';
import {ServiceType} from '../types';
import {styles} from '../app/styles';

export default function ServiceSelection(): JSX.Element {
  const {
    selectedService,
    setSelectedService,
    setLocationData,
    setDateType,
    setDisplayDate,
    setNeedTimeOfDay,
    setSelectedTimeSlot,
    setErrors,
  } = useLocationDate();

  const handleServiceSelect = (service: ServiceType) => {
    setSelectedService(service);
    // Reset form when service changes
    setLocationData({
      lga: '',
      area: '',
      busStop: '',
      landmark: '',
    });
    setDateType(null);
    setDisplayDate('');
    setNeedTimeOfDay(false);
    setSelectedTimeSlot(null);
    setErrors({
      area: '',
      busStop: '',
      landmark: '',
    });
  };

  return (
    <View>
      <Text style={styles.title}>Location & Date</Text>
      <Text style={styles.subtitle}>
        Select the category that best fits your needs.
      </Text>
      <View style={styles.serviceCards}>
        {(['residential', 'onsite'] as const).map(service => (
          <TouchableOpacity
            key={service}
            style={[
              styles.card,
              selectedService === service
                ? styles.selectedCard
                : styles.unselectedCard,
            ]}
            onPress={() => handleServiceSelect(service)}>
            <View style={styles.radioOuter}>
              <View
                style={[
                  styles.radioInner,
                  selectedService === service && styles.radioSelected,
                ]}
              />
            </View>
            <Text
              style={[
                styles.cardTitle,
                selectedService === service && styles.selectedText,
              ]}>
              {service === 'residential'
                ? 'Residential Service'
                : 'On-Site Service'}
            </Text>
            <Text
              style={[
                styles.cardDescription,
                selectedService === service && styles.selectedText,
              ]}>
              {service === 'residential'
                ? 'Select this if you need the task done at a particular location of your choice'
                : 'Select this if you are more happy to go to the registered business address'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
