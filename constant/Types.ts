export type RequestStatus = "Pending" | "Approved" | "Rejected";
export type RequestType = "Type Rating" | "Recurrency" | "Checkout" | "Proficiency" | "Initial";

export interface Request {
  id: string;
  name: string;
  rank: string;
  licenseId: string;
  status: RequestStatus;
  type: RequestType;
  aircraft: string;
  aircraftId?: string;
  duration: string;
  requestedDate?: string;
  submittedDate?: string;
  preferredTimes?: string;
  reason?: string;
  isUrgent?: boolean;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  progress: number;
  enrolled: number;
  category: string;
  color: string;
}