import { Models } from "react-native-appwrite";

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
    lastname:string;
    flightHours:number;
    email: string;
    licenseNumber: string;
    rank:string;
    dateOfBirth:string;
    isActive:boolean;
    status:PilotStatus;
    activeStatus:PilotActivityStatus;
    academy:string
}

export interface PilotDocument extends Pilot, Models.Document {}



export enum EquipmentStatus {
    Operational = 'operational',
    Maintenance = 'maintenance',
    Grounded = 'grounded',
}
//Simulators

export interface Simulator {
    $id: string;
    simulatorModel: string;
    installationDate:string;
    lastMaintenanceDate:string;
    location:string;
    status:EquipmentStatus;
    maxOccupancy:number;
    images:string[];
}

//Aircraft
export interface Plane {
    $id: string;
    name:string;
    modelNumber:string;
    manufacturer:string;
    purchaseDate:string;
    lastServiceDate:string;
    lastCheckDate:string;
    status:EquipmentStatus;
    maxOccupancy:number;
    location:string;
    images:string[];
}