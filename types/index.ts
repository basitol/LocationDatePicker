export type ServiceType = 'residential' | 'onsite' | null;
export type DateType = 'fixed' | 'flexible' | null;

export interface LocationData {
  lga: string;
  area: string;
  busStop: string;
  landmark: string;
}

export interface LocationErrors {
  area: string;
  busStop: string;
  landmark: string;
}

export interface TimeSlot {
  id: string;
  title: string;
  range: string;
  image: any; // Consider using a more specific type for images
}

export interface LocationDateContextType {
  selectedService: ServiceType;
  setSelectedService: (service: ServiceType) => void;
  locationData: LocationData;
  setLocationData: React.Dispatch<React.SetStateAction<LocationData>>;
  dateType: DateType;
  setDateType: (type: DateType) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  displayDate: string;
  setDisplayDate: (date: string) => void;
  needTimeOfDay: boolean;
  setNeedTimeOfDay: (need: boolean) => void;
  selectedTimeSlot: string | null;
  setSelectedTimeSlot: (slot: string | null) => void;
  errors: LocationErrors;
  setErrors: React.Dispatch<React.SetStateAction<LocationErrors>>;
}
