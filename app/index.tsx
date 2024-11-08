// 'use client';

// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   Platform,
//   Image,
//   TextInput,
// } from 'react-native';
// import {SelectList} from 'react-native-dropdown-select-list';
// import {useNavigation} from 'expo-router';
// import DateTimePicker from '@react-native-community/datetimepicker';

// // Define types for better type safety
// type ServiceType = 'residential' | 'onsite' | null;
// type DateType = 'fixed' | 'flexible' | null;
// type TimeSlot = {
//   id: string;
//   title: string;
//   range: string;
//   image: any; // Using 'any' for image require statement
// };

// type LocationData = {
//   lga: string;
//   area: string;
//   busStop: string;
//   landmark: string;
// };

// type LocationErrors = {
//   area: string;
//   busStop: string;
//   landmark: string;
// };

// export default function LocationDateSelector() {
//   const navigation = useNavigation();

//   // State management
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [selectedService, setSelectedService] = useState<ServiceType>(null);
//   const [locationData, setLocationData] = useState<{
//     lga: string;
//     area: string;
//     busStop: string;
//     landmark: string;
//   }>({
//     lga: '',
//     area: '',
//     busStop: '',
//     landmark: '',
//   });
//   const [dateType, setDateType] = useState<DateType>(null);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [displayDate, setDisplayDate] = useState('');
//   const [needTimeOfDay, setNeedTimeOfDay] = useState<boolean>(false);
//   const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

//   // Field error states
//   const [errors, setErrors] = useState({
//     area: '',
//     busStop: '',
//     landmark: '',
//   });

//   const TIME_SLOTS: TimeSlot[] = [
//     {
//       id: 'morning',
//       title: 'Morning',
//       range: '7:00am to 11:59am',
//       image: require('../assets/sunset.png'), // Make sure to add these images to your assets folder
//     },
//     {
//       id: 'afternoon',
//       title: 'Afternoon',
//       range: '12:00pm to 4:59pm',
//       image: require('../assets/sun.png'),
//     },
//     {
//       id: 'evening',
//       title: 'Evening',
//       range: '5:00pm to 9:59pm',
//       image: require('../assets/moon.png'),
//     },
//     {
//       id: 'allday',
//       title: 'All Day',
//       range: '7:00am to 9:59pm',
//       image: require('../assets/clock.png'),
//     },
//   ];

//   React.useEffect(() => {
//     navigation.setOptions({headerShown: false});
//   }, [navigation]);

//   const renderLocationForm = () => {
//     if (selectedService !== 'residential') return null;

//     return (
//       <View style={styles.formSection}>
//         <Text style={styles.sectionTitle}>
//           Where do you want the task done?
//         </Text>

//         <SelectList
//           setSelected={(value: string) => {
//             handleLocationUpdate('lga', value);
//             // Clear subsequent fields when LGA changes
//             setLocationData(prev => ({
//               ...prev,
//               lga: value,
//               area: '',
//               busStop: '',
//               landmark: '',
//             }));
//             // Clear errors
//             setErrors({
//               area: '',
//               busStop: '',
//               landmark: '',
//             });
//           }}
//           data={[{key: '1', value: 'Ido'}]}
//           save='value'
//           placeholder='Select Local Government'
//           boxStyles={styles.selectBox}
//         />

//         {locationData.lga && (
//           <View style={[styles.inputContainer, styles.fadeIn]}>
//             <TextInput
//               style={[styles.input, errors.area ? styles.inputError : null]}
//               placeholder='Enter your house address'
//               value={locationData.area}
//               onChangeText={value => {
//                 handleInputChange('area', value);
//                 // Clear subsequent fields when area changes
//                 if (value.length < locationData.area.length) {
//                   setLocationData(prev => ({
//                     ...prev,
//                     busStop: '',
//                     landmark: '',
//                   }));
//                 }
//               }}
//               placeholderTextColor='#666'
//             />
//             {errors.area ? (
//               <Text style={styles.errorText}>{errors.area}</Text>
//             ) : null}
//           </View>
//         )}

//         {locationData.lga &&
//           locationData.area.trim().length >= 3 &&
//           !errors.area && (
//             <View style={[styles.inputContainer, styles.fadeIn]}>
//               <TextInput
//                 style={[
//                   styles.input,
//                   errors.busStop ? styles.inputError : null,
//                 ]}
//                 placeholder='Enter closest bus stop'
//                 value={locationData.busStop}
//                 onChangeText={value => {
//                   handleInputChange('busStop', value);
//                   // Clear landmark when bus stop changes
//                   if (value.length < locationData.busStop.length) {
//                     setLocationData(prev => ({
//                       ...prev,
//                       landmark: '',
//                     }));
//                   }
//                 }}
//                 placeholderTextColor='#666'
//               />
//               {errors.busStop ? (
//                 <Text style={styles.errorText}>{errors.busStop}</Text>
//               ) : null}
//             </View>
//           )}

//         {locationData.lga &&
//           locationData.area.trim().length >= 3 &&
//           locationData.busStop.trim().length >= 3 &&
//           !errors.area &&
//           !errors.busStop && (
//             <View style={[styles.inputContainer, styles.fadeIn]}>
//               <TextInput
//                 style={[
//                   styles.input,
//                   errors.landmark ? styles.inputError : null,
//                 ]}
//                 placeholder='Enter nearby landmark'
//                 value={locationData.landmark}
//                 onChangeText={value => handleInputChange('landmark', value)}
//                 placeholderTextColor='#666'
//               />
//               {errors.landmark ? (
//                 <Text style={styles.errorText}>{errors.landmark}</Text>
//               ) : null}
//             </View>
//           )}
//       </View>
//     );
//   };

//   const validateField = (field: string, value: string) => {
//     if (!value.trim()) {
//       return `${field} is required`;
//     }
//     if (value.length < 3) {
//       return `${field} must be at least 3 characters`;
//     }
//     return '';
//   };

//   const handleInputChange = (
//     field: keyof typeof locationData,
//     value: string,
//   ) => {
//     setLocationData(prev => ({...prev, [field]: value}));

//     // Clear error when user starts typing
//     setErrors(prev => ({...prev, [field]: ''}));

//     // Validate on blur
//     const error = validateField(field, value);
//     if (error) {
//       setErrors(prev => ({...prev, [field]: error}));
//     }
//   };

//   const handleLocationUpdate = (field: keyof LocationData, value: string) => {
//     setLocationData(prev => ({...prev, [field]: value}));

//     // Clear error when user starts typing
//     if (field in errors) {
//       setErrors(prev => ({...prev, [field]: ''}));
//     }
//   };

//   const onDateChange = (event: any, selected?: Date) => {
//     setShowDatePicker(Platform.OS === 'ios');
//     if (selected) {
//       setSelectedDate(selected);
//       const formattedDate = selected.toLocaleDateString('en-GB', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//       });
//       setDisplayDate(formattedDate);
//     }
//   };

//   // Check if continue button should be active
//   const isContinueEnabled = () => {
//     if (selectedService === 'onsite') {
//       if (dateType === 'fixed') {
//         return selectedDate && (!needTimeOfDay || selectedTimeSlot);
//       }
//       return dateType === 'flexible';
//     }

//     if (selectedService === 'residential') {
//       const isLocationComplete =
//         locationData.lga !== '' &&
//         locationData.area.trim() !== '' &&
//         locationData.busStop.trim() !== '' &&
//         locationData.landmark.trim() !== '';
//       const noErrors = Object.values(errors).every(error => !error);

//       if (!isLocationComplete || !noErrors) return false;

//       if (dateType === 'fixed') {
//         return selectedDate && (!needTimeOfDay || selectedTimeSlot);
//       }
//       return dateType === 'flexible';
//     }

//     return false;
//   };

//   // Handle continue button press
//   const handleContinue = () => {
//     // Validate all fields before continuing
//     const newErrors = {
//       area: validateField('House Address', locationData.area),
//       busStop: validateField('Bus Stop', locationData.busStop),
//       landmark: validateField('Landmark', locationData.landmark),
//     };

//     setErrors(newErrors);

//     if (Object.values(newErrors).some(error => error !== '')) {
//       return;
//     }

//     console.log('Form submitted:', {
//       selectedService,
//       locationData,
//       dateType,
//       selectedDate,
//       needTimeOfDay,
//       selectedTimeSlot,
//     });
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView style={styles.container}>
//         <Text style={styles.title}>Location & Date</Text>
//         <Text style={styles.subtitle}>
//           Select the category that best fits your needs.
//         </Text>

//         {/* Service Selection Cards */}
//         <View style={styles.serviceCards}>
//           {['residential', 'onsite'].map(service => (
//             <TouchableOpacity
//               key={service}
//               style={[
//                 styles.card,
//                 selectedService === service
//                   ? styles.selectedCard
//                   : styles.unselectedCard,
//               ]}
//               onPress={() => {
//                 setSelectedService(service as ServiceType);
//                 setLocationData({lga: '', area: '', busStop: '', landmark: ''});
//                 setDateType(null);
//                 setDisplayDate('');
//                 setNeedTimeOfDay(false);
//                 setSelectedTimeSlot(null);
//                 setErrors({area: '', busStop: '', landmark: ''});
//               }}>
//               <View style={styles.radioOuter}>
//                 <View
//                   style={[
//                     styles.radioInner,
//                     selectedService === service && styles.radioSelected,
//                   ]}
//                 />
//               </View>
//               <Text
//                 style={[
//                   styles.cardTitle,
//                   selectedService === service && styles.selectedText,
//                 ]}>
//                 {service === 'residential'
//                   ? 'Residential Service'
//                   : 'On-Site Service'}
//               </Text>
//               <Text
//                 style={[
//                   styles.cardDescription,
//                   selectedService === service && styles.selectedText,
//                 ]}>
//                 {service === 'residential'
//                   ? 'Select this if you need the task done at a particular location of your choice'
//                   : 'Select this if you are more happy to go to the registered business address'}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Location Form */}
//         {renderLocationForm()}

//         {/* Date Selection Section */}
//         {(selectedService === 'onsite' ||
//           (selectedService === 'residential' &&
//             Object.values(locationData).every(value => value !== ''))) && (
//           <View style={styles.dateSection}>
//             <Text style={styles.sectionTitle}>When do you need this done?</Text>
//             <View style={styles.dateOptions}>
//               {['fixed', 'flexible'].map(type => (
//                 <TouchableOpacity
//                   key={type}
//                   style={[
//                     styles.dateOption,
//                     dateType === type && styles.selectedDateOption,
//                   ]}
//                   onPress={() => {
//                     setDateType(type as DateType);
//                     setDisplayDate('');
//                     setNeedTimeOfDay(false);
//                     setSelectedTimeSlot(null);
//                     // If flexible is selected, we don't need date selection
//                     if (type === 'flexible') {
//                       setSelectedDate(new Date());
//                       setDisplayDate('Flexible');
//                     }
//                   }}>
//                   <View style={styles.dateOptionContent}>
//                     {dateType === type && (
//                       <View style={styles.checkmark}>
//                         <Text style={styles.checkmarkText}>✓</Text>
//                       </View>
//                     )}
//                     <Text
//                       style={[
//                         styles.dateOptionText,
//                         dateType === type && styles.selectedDateOptionText,
//                       ]}>
//                       {type === 'fixed' ? 'On date' : "I'm flexible"}
//                     </Text>
//                   </View>
//                 </TouchableOpacity>
//               ))}
//             </View>

//             {/* For Fixed Date: Show DatePicker first */}
//             {dateType === 'fixed' && (
//               <>
//                 <TouchableOpacity
//                   style={[
//                     styles.dateInput,
//                     displayDate ? styles.dateInputSelected : null,
//                   ]}
//                   onPress={() => setShowDatePicker(true)}>
//                   <Text
//                     style={[
//                       styles.dateInputText,
//                       displayDate ? {color: '#000'} : {color: '#666'},
//                     ]}>
//                     {displayDate || 'Select date'}
//                   </Text>
//                   <TouchableOpacity onPress={() => setShowDatePicker(true)}>
//                     <Image
//                       source={require('../assets/calendar.png')}
//                       style={{width: 24, height: 24, tintColor: '#666'}}
//                     />
//                   </TouchableOpacity>
//                 </TouchableOpacity>

//                 {(showDatePicker || Platform.OS === 'ios') && (
//                   <DateTimePicker
//                     value={selectedDate}
//                     mode='date'
//                     display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                     onChange={onDateChange}
//                     minimumDate={new Date()}
//                     style={
//                       Platform.OS === 'ios' ? styles.iosDatePicker : undefined
//                     }
//                   />
//                 )}
//               </>
//             )}

//             {/* Show time checkbox after date is selected for fixed date,
//         or immediately for flexible date */}
//             {((dateType === 'fixed' && displayDate) ||
//               dateType === 'flexible') && (
//               <TouchableOpacity
//                 style={[
//                   styles.timeOfDayOption,
//                   needTimeOfDay ? styles.timeOfDaySelected : null,
//                 ]}
//                 onPress={() => setNeedTimeOfDay(!needTimeOfDay)}>
//                 <View
//                   style={[
//                     styles.checkBox,
//                     needTimeOfDay ? styles.checkBoxSelected : null,
//                   ]}>
//                   {needTimeOfDay && <Text style={styles.checkBoxText}>✓</Text>}
//                 </View>
//                 <Text style={styles.timeOfDayText}>
//                   I need a certain time of day
//                 </Text>
//               </TouchableOpacity>
//             )}

//             {/* {needTimeOfDay && (
//               <View style={styles.timeSlots}>
//                 {TIME_SLOTS.map(slot => (
//                   <TouchableOpacity
//                     key={slot.id}
//                     style={[
//                       styles.timeSlot,
//                       selectedTimeSlot === slot.id
//                         ? styles.selectedTimeSlot
//                         : null,
//                     ]}
//                     onPress={() => setSelectedTimeSlot(slot.id)}>
//                     <View style={styles.timeSlotContent}>
//                       <View style={styles.timeSlotIcon}>
//                         <Image
//                           source={slot.image}
//                           style={styles.timeSlotImage}
//                           resizeMode='contain'
//                         />
//                       </View>
//                       <Text style={styles.timeSlotTitle}>{slot.title}</Text>
//                       <Text style={styles.timeSlotRange}>
//                         The time range is {slot.range}
//                       </Text>
//                     </View>
//                     <View
//                       style={[
//                         styles.timeSlotRadio,
//                         selectedTimeSlot === slot.id
//                           ? styles.timeSlotRadioSelected
//                           : null,
//                       ]}>
//                       {selectedTimeSlot === slot.id && (
//                         <View style={styles.timeSlotRadioInner} />
//                       )}
//                     </View>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )} */}

//             {needTimeOfDay && (
//               <View style={styles.timeSlots}>
//                 {TIME_SLOTS.map(slot => (
//                   <TouchableOpacity
//                     key={slot.id}
//                     style={[
//                       styles.timeSlot,
//                       selectedTimeSlot === slot.id && styles.selectedTimeSlot,
//                     ]}
//                     onPress={() => setSelectedTimeSlot(slot.id)}>
//                     <View style={styles.timeSlotContent}>
//                       <View
//                         style={[
//                           styles.timeSlotIcon,
//                           selectedTimeSlot === slot.id &&
//                             styles.selectedTimeSlotIcon,
//                         ]}>
//                         <Image
//                           source={slot.image}
//                           style={[
//                             styles.timeSlotImage,
//                             selectedTimeSlot === slot.id &&
//                               styles.selectedTimeSlotImage,
//                           ]}
//                           resizeMode='contain'
//                         />
//                       </View>
//                       <Text
//                         style={[
//                           styles.timeSlotTitle,
//                           selectedTimeSlot === slot.id &&
//                             styles.selectedTimeSlotText,
//                         ]}>
//                         {slot.title}
//                       </Text>
//                       <View style={styles.timeSlotRangeContainer}>
//                         <Text
//                           style={[
//                             styles.timeSlotRangeLabel,
//                             selectedTimeSlot === slot.id &&
//                               styles.selectedTimeSlotText,
//                           ]}>
//                           The time range is{' '}
//                         </Text>
//                         <Text
//                           style={[
//                             styles.timeSlotRangeValue,
//                             selectedTimeSlot === slot.id &&
//                               styles.selectedTimeSlotText,
//                           ]}>
//                           {slot.range}
//                         </Text>
//                       </View>
//                     </View>
//                     <View
//                       style={[
//                         styles.timeSlotRadio,
//                         selectedTimeSlot === slot.id &&
//                           styles.timeSlotRadioSelected,
//                       ]}>
//                       {selectedTimeSlot === slot.id && (
//                         <View style={styles.timeSlotRadioInner} />
//                       )}
//                     </View>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}
//           </View>
//         )}

//         {/* Continue Button */}
//         <TouchableOpacity
//           style={[
//             styles.continueButton,
//             !isContinueEnabled() && styles.continueButtonDisabled,
//           ]}
//           onPress={handleContinue}
//           disabled={!isContinueEnabled()}>
//           <Text style={styles.continueButtonText}>Continue</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   container: {
//     flex: 1,
//     paddingHorizontal: 20,
//     paddingTop: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#0C2039',
//     marginBottom: 8,
//     fontFamily: 'Helvetica',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#0C2039',
//     marginBottom: 24,
//     fontFamily: 'Avenir',
//   },
//   serviceCards: {
//     flexDirection: 'row',
//     gap: 16,
//     marginBottom: 10,
//   },
//   card: {
//     flex: 1,
//     height: 154,
//     borderRadius: 12,
//     paddingTop: 49,
//     paddingHorizontal: 10,
//     position: 'relative',
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   selectedCard: {
//     backgroundColor: '#00763E',
//   },
//   unselectedCard: {
//     backgroundColor: '#f5f5f5',
//   },
//   cardTitle: {
//     fontSize: 14,
//     fontWeight: '700',
//     marginBottom: 8,
//     color: '#000',
//     fontFamily: 'Helvetica',
//   },
//   cardDescription: {
//     fontSize: 12,
//     color: '#666',
//     lineHeight: 16,
//     fontFamily: 'Avenir',
//     fontWeight: '500',
//   },
//   selectedText: {
//     color: '#fff',
//   },
//   radioOuter: {
//     position: 'absolute',
//     top: 16,
//     left: 10,
//     width: 20,
//     height: 20,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: '#ccc',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   radioInner: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: 'transparent',
//   },
//   radioSelected: {
//     backgroundColor: '#fff',
//   },
//   formSection: {
//     gap: 8,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 0,
//     color: '#0C2039',
//     fontFamily: 'Avenir',
//   },
//   selectBox: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     backgroundColor: '#f5f5f5',
//   },
//   inputGroup: {
//     marginTop: 0,
//   },
//   dateSection: {
//     marginTop: 20,
//   },
//   dateOptions: {
//     flexDirection: 'row',
//     gap: 16,
//     marginTop: 10,
//     marginBottom: 20,
//   },
//   dateOption: {
//     flex: 1,
//     padding: 16,
//     borderRadius: 8,
//     backgroundColor: '#f5f5f5',
//   },
//   dateOptionContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   selectedDateOption: {
//     backgroundColor: '#f5f5f5',
//   },
//   checkmark: {
//     marginRight: 8,
//     width: 18,
//     height: 18,
//     borderRadius: 3,
//     backgroundColor: '#00763E',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   checkmarkText: {
//     color: '#fff',
//     fontSize: 14,
//   },
//   dateOptionText: {
//     color: '#000',
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   selectedDateOptionText: {
//     color: '#000',
//   },
//   dateInput: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 16,
//     backgroundColor: '#f5f5f5',
//     borderRadius: 8,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   dateInputSelected: {
//     borderColor: '#00763E',
//     borderWidth: 1,
//   },
//   dateInputText: {
//     fontSize: 16,
//     color: '#666',
//   },
//   timeOfDayOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   timeOfDaySelected: {
//     backgroundColor: '#fff',
//   },
//   checkBox: {
//     width: 20,
//     height: 20,
//     borderRadius: 4,
//     borderWidth: 2,
//     // backgroundColor: '#C7C7C7',
//     borderColor: '#C7C7C7',
//     marginRight: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   checkBoxSelected: {
//     backgroundColor: '#00763E',
//     borderColor: '#00763E',
//   },
//   checkBoxText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   timeOfDayText: {
//     fontSize: 14,
//     color: '#000',
//     fontFamily: 'Avenir',
//   },
//   timeSlots: {
//     gap: 10,
//   },
//   timeSlot: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 16,
//     paddingHorizontal: 16,
//     backgroundColor: '#f5f5f5',
//     borderRadius: 12,
//     gap: 16,
//   },
//   selectedTimeSlot: {
//     backgroundColor: '#00763E',
//   },
//   timeSlotIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   selectedTimeSlotIcon: {
//     backgroundColor: '#fff',
//   },
//   timeSlotContent: {
//     flex: 1,
//   },
//   timeSlotTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     marginBottom: 4,
//     color: '#0C2039',
//     fontFamily: 'Helvetica',
//   },
//   timeSlotRange: {
//     fontSize: 14,
//     color: '#666',
//     fontFamily: 'Avenir',
//   },
//   timeSlotRangeContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   timeSlotRangeLabel: {
//     fontSize: 12,
//     color: '#0C2039',
//     fontFamily: 'Avenir',
//     fontWeight: '500',
//   },
//   timeSlotRangeValue: {
//     fontSize: 12,
//     color: '#0C2039',
//     fontFamily: 'Avenir',
//     fontWeight: '800',
//   },
//   selectedTimeSlotText: {
//     color: '#fff',
//   },
//   timeSlotImage: {
//     width: 24,
//     height: 24,
//     tintColor: '#292D32',
//   },
//   selectedTimeSlotImage: {
//     tintColor: '#00763E',
//   },
//   timeSlotRadio: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: '#DBDBDB',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   timeSlotRadioSelected: {
//     backgroundColor: '#00763E',
//     borderColor: '#fff',
//   },
//   timeSlotRadioInner: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: '#fff',
//   },
//   continueButton: {
//     backgroundColor: '#00763E',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 24,
//     marginBottom: 32,
//   },
//   continueButtonDisabled: {
//     // backgroundColor: '#E0E0E0',
//     backgroundColor: '#00763E80',
//     opacity: 0.7,
//   },
//   continueButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//     fontFamily: 'Helvetica',
//   },
//   iosDatePicker: {
//     width: '100%',
//     backgroundColor: 'white',
//   },
//   button: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderRadius: 8,
//     backgroundColor: '#f5f5f5',
//     marginBottom: 16,
//   },
//   buttonText: {
//     color: '#666',
//     fontSize: 16,
//     fontWeight: '600',
//     fontFamily: 'Helvetica',
//     marginLeft: 8,
//   },
//   input: {
//     height: 50,
//     backgroundColor: '#f5f5f5',
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     fontSize: 16,
//     color: '#000',
//   },
//   inputError: {
//     borderColor: '#ff4444',
//     borderWidth: 1,
//   },
//   errorText: {
//     color: '#ff4444',
//     fontSize: 12,
//     marginTop: 4,
//     marginLeft: 4,
//   },
//   fadeIn: {
//     opacity: 1,
//     transform: [{translateY: 0}],
//   },
//   inputContainer: {
//     marginTop: 0,
//     opacity: 0,
//     transform: [{translateY: 10}],
//     animation: 'fadeIn 0.3s ease-in-out forwards',
//   },
// });

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
          {/* <Text style={styles.title}>Location & Date</Text>
          <Text style={styles.subtitle}>
            Select the category that best fits your needs.
          </Text> */}
          <ServiceSelection />
          <LocationForm />
          <DateTimeSelection />
          <ContinueButton />
        </ScrollView>
      </SafeAreaView>
    </LocationDateProvider>
  );
}
