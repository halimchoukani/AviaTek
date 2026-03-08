import { Models } from "react-native-appwrite";

// Academies
export interface Academy {
    $id: string;
    name: string;
    type: string;
    country: string;
    city: string;
    address: string;
    certifications: string[];
    email: string;
    phone: string;
    website?: string;
    adminName: string;
    adminEmail: string;
    isVerified: boolean;
}

export interface AcademyDocument extends Academy, Models.Document { }

//Pilots

export enum PilotStatus {
    Online = 'online',
    Offline = 'offline',
}

export enum PilotActivityStatus {
    Active = 'active',
    OnLeave = 'on_leave',
    On_Duty = 'on_duty',
}

export interface Pilot {
    $id: string;
    name: string;
    lastname: string;
    flightHours: number;
    email: string;
    licenseNumber: string;
    rank: string;
    dateOfBirth: string;
    isVerified: boolean;
    status: PilotStatus;
    activeStatus: PilotActivityStatus;
    academy: string;
    phone: string;
    licenseExpiry?: string;
    medicalClass?: string;
    medicalExpiry?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
}

export interface PilotDocument extends Pilot, Models.Document {
    prefs?: {
        academyId?: string;
        role?: string;
        [key: string]: any;
    };
}



export enum EquipmentStatus {
    Operational = 'operational',
    Maintenance = 'maintenance',
    Grounded = 'grounded',
}
//Simulators

export interface Simulator {
    $id: string;
    simulatorModel: string;
    installationDate: string;
    lastMaintenanceDate: string;
    location: string;
    status: EquipmentStatus;
    maxOccupancy: number;
    images: string[];
    academy: string;
}

//Aircraft
export interface Plane {
    $id: string;
    name: string;
    modelNumber: string;
    manufacturer: string;
    purchaseDate: string;
    lastServiceDate: string;
    lastCheckDate: string;
    status: EquipmentStatus;
    maxOccupancy: number;
    location: string;
    images: string[];
    academy: string;
}

export enum RequestStatus {
    Pending = 'pending',
    Approved = 'approved',
    Rejected = 'rejected',
}
export enum PreferredTimes {
    Morning = 'morning',
    Afternoon = 'afternoon',
    Evening = 'evening',

}

//requests
export interface Request {
    $id: string;
    pilotId: string;
    academyId: string;
    note: string;
    equipmentId: string;
    status: RequestStatus;
    startDate: string; // ISO string with date and time
    hours: number;
    preferredTimes: PreferredTimes;
    sessionType: string;
    response?: string;
}

export interface RequestDocument extends Request, Models.Document { }

export enum ScheduleStatus {
    Confirmed = 'confirmed',
    Pending = 'pending',
}

// Schedules
export interface Schedule {
    $id: string;
    startTime: string;   // ISO datetime
    endTime: string;     // ISO datetime
    notes: string;
    equipmentId: string;
    sessionType: string;
    status: ScheduleStatus;
    academyId: string;
    pilotId: string;
}

export interface ScheduleDocument extends Schedule, Models.Document { }


//all users
export interface User {
    $id: string;
    name: string;
    lastname: string;
    email: string;
    prefs?: {
        academyId?: string;
        role?: string;
        [key: string]: any;
    };
}


export interface Notification {
    title: string;
    content: string;
    type: string;
    read: boolean;
    userId: string;
}

export interface NotificationDocument extends Notification, Models.Document { }