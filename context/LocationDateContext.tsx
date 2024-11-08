import React, {createContext, useContext, useState, ReactNode} from 'react';
import {
  LocationDateContextType,
  ServiceType,
  LocationData,
  LocationErrors,
  DateType,
} from '../types';

const LocationDateContext = createContext<LocationDateContextType | undefined>(
  undefined,
);

interface LocationDateProviderProps {
  children: ReactNode;
}

export function LocationDateProvider({children}: LocationDateProviderProps) {
  const [selectedService, setSelectedService] = useState<ServiceType>(null);
  const [locationData, setLocationData] = useState<LocationData>({
    lga: '',
    area: '',
    busStop: '',
    landmark: '',
  });
  const [dateType, setDateType] = useState<DateType>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [displayDate, setDisplayDate] = useState<string>('');
  const [needTimeOfDay, setNeedTimeOfDay] = useState<boolean>(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [errors, setErrors] = useState<LocationErrors>({
    area: '',
    busStop: '',
    landmark: '',
  });

  const value: LocationDateContextType = {
    selectedService,
    setSelectedService,
    locationData,
    setLocationData,
    dateType,
    setDateType,
    selectedDate,
    setSelectedDate,
    displayDate,
    setDisplayDate,
    needTimeOfDay,
    setNeedTimeOfDay,
    selectedTimeSlot,
    setSelectedTimeSlot,
    errors,
    setErrors,
  };

  return (
    <LocationDateContext.Provider value={value}>
      {children}
    </LocationDateContext.Provider>
  );
}

export function useLocationDate(): LocationDateContextType {
  const context = useContext(LocationDateContext);
  if (!context) {
    throw new Error(
      'useLocationDate must be used within a LocationDateProvider',
    );
  }
  return context;
}
