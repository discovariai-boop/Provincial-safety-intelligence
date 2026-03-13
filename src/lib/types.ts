export type EmergencyContact = {
  name: string;
  phone: string;
  relationship: string;
};

export type Profile = {
  name: string;
  idNumber: string;
  bloodType: string;
  allergies: string;
  vehicleReg: string;
  emergencyContacts: EmergencyContact[];
};

export type Alert = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  thumbnailUrl: string;
  location: string;
};

export type Responder = {
  name: string;
  unit: string;
  eta: string;
  avatarUrl: string;
  isStreaming: boolean;
};
