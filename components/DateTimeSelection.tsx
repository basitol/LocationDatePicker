import React, {useState} from 'react';
import {View, TouchableOpacity, Text, Platform, Image} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {useLocationDate} from '../context/LocationDateContext';
import {styles} from '../app/styles';

const TIME_SLOTS = [
  {
    id: 'morning',
    title: 'Morning',
    range: '7:00am to 11:59am',
    image: require('../assets/sunset.png'),
  },
  {
    id: 'afternoon',
    title: 'Afternoon',
    range: '12:00pm to 4:59pm',
    image: require('../assets/sun.png'),
  },
  {
    id: 'evening',
    title: 'Evening',
    range: '5:00pm to 9:59pm',
    image: require('../assets/moon.png'),
  },
  {
    id: 'allday',
    title: 'All Day',
    range: '7:00am to 9:59pm',
    image: require('../assets/clock.png'),
  },
];

export default function DateTimeSelection(): JSX.Element | null {
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const {
    selectedService,
    locationData,
    selectedDate,
    setSelectedDate,
    displayDate,
    setDisplayDate,
    dateType,
    setDateType,
    needTimeOfDay,
    setNeedTimeOfDay,
    selectedTimeSlot,
    setSelectedTimeSlot,
  } = useLocationDate();

  const shouldShowDateSelection = (): boolean => {
    if (selectedService === 'onsite') {
      return true;
    }
    if (selectedService === 'residential') {
      return Boolean(
        locationData.lga &&
          locationData.area.trim() &&
          locationData.busStop.trim() &&
          locationData.landmark.trim(),
      );
    }
    return false;
  };

  if (!shouldShowDateSelection()) {
    return null;
  }

  const onDateChange = (event: DateTimePickerEvent, selected?: Date): void => {
    if (event.type === 'set' && selected) {
      setSelectedDate(selected);
      const formattedDate = selected.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      setDisplayDate(formattedDate);
    }
    setShowDatePicker(false);
  };

  const renderDateOption = (type: 'fixed' | 'flexible') => {
    const isSelected = dateType === type;
    return (
      <TouchableOpacity
        key={type}
        style={[styles.dateOption, isSelected && styles.selectedDateOption]}
        onPress={() => {
          setDateType(type);
          setDisplayDate('');
          setNeedTimeOfDay(false);
          setSelectedTimeSlot(null);
          if (type === 'flexible') {
            setSelectedDate(new Date());
            setDisplayDate('Flexible');
          }
        }}>
        <View style={styles.dateOptionContent}>
          <View
            style={[
              styles.checkmark,
              !isSelected && styles.checkmarkUnselected,
            ]}>
            {isSelected && <Text style={styles.checkmarkText}>✓</Text>}
          </View>
          <Text
            style={[
              styles.dateOptionText,
              isSelected && styles.selectedDateOptionText,
            ]}>
            {type === 'fixed' ? 'On date' : "I'm flexible"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.dateSection}>
      <Text style={styles.sectionTitle}>When do you need this done?</Text>

      <View style={styles.dateOptions}>
        {(['fixed', 'flexible'] as const).map(type => renderDateOption(type))}
      </View>

      {dateType === 'fixed' && (
        <>
          <TouchableOpacity
            style={[
              styles.dateInput,
              displayDate ? styles.dateInputSelected : null,
            ]}
            onPress={() => setShowDatePicker(true)}>
            <Text
              style={[
                styles.dateInputText,
                displayDate ? {color: '#000'} : {color: '#666'},
              ]}>
              {displayDate || 'Select date'}
            </Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Image
                source={require('../assets/calendar.png')}
                style={{width: 24, height: 24, tintColor: '#666'}}
              />
            </TouchableOpacity>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode='date'
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              minimumDate={new Date()}
              style={Platform.OS === 'ios' ? styles.iosDatePicker : undefined}
            />
          )}
        </>
      )}

      {/* Show time checkbox after date is selected for fixed date,
          or immediately for flexible date */}
      {((dateType === 'fixed' && displayDate) || dateType === 'flexible') && (
        <TouchableOpacity
          style={[
            styles.timeOfDayOption,
            needTimeOfDay ? styles.timeOfDaySelected : null,
          ]}
          onPress={() => {
            setNeedTimeOfDay(!needTimeOfDay);
            if (!needTimeOfDay) {
              setSelectedTimeSlot(null);
            }
          }}>
          <View
            style={[
              styles.checkBox,
              needTimeOfDay ? styles.checkBoxSelected : null,
            ]}>
            {needTimeOfDay && <Text style={styles.checkBoxText}>✓</Text>}
          </View>
          <Text style={styles.timeOfDayText}>I need a certain time of day</Text>
        </TouchableOpacity>
      )}

      {/* Time slots */}
      {needTimeOfDay && (
        <View style={styles.timeSlots}>
          {TIME_SLOTS.map(slot => (
            <TouchableOpacity
              key={slot.id}
              style={[
                styles.timeSlot,
                selectedTimeSlot === slot.id && styles.selectedTimeSlot,
              ]}
              onPress={() => setSelectedTimeSlot(slot.id)}>
              <View style={styles.timeSlotContent}>
                <View
                  style={[
                    styles.timeSlotIcon,
                    selectedTimeSlot === slot.id && styles.selectedTimeSlotIcon,
                  ]}>
                  <Image
                    source={slot.image}
                    style={[
                      styles.timeSlotImage,
                      selectedTimeSlot === slot.id &&
                        styles.selectedTimeSlotImage,
                    ]}
                    resizeMode='contain'
                  />
                </View>
                <Text
                  style={[
                    styles.timeSlotTitle,
                    selectedTimeSlot === slot.id && styles.selectedTimeSlotText,
                  ]}>
                  {slot.title}
                </Text>
                <View style={styles.timeSlotRangeContainer}>
                  <Text
                    style={[
                      styles.timeSlotRangeLabel,
                      selectedTimeSlot === slot.id &&
                        styles.selectedTimeSlotText,
                    ]}>
                    The time range is{' '}
                  </Text>
                  <Text
                    style={[
                      styles.timeSlotRangeValue,
                      selectedTimeSlot === slot.id &&
                        styles.selectedTimeSlotText,
                    ]}>
                    {slot.range}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.timeSlotRadio,
                  selectedTimeSlot === slot.id && styles.timeSlotRadioSelected,
                ]}>
                {selectedTimeSlot === slot.id && (
                  <View style={styles.timeSlotRadioInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
