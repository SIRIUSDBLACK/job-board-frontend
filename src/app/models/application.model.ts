export interface IncomingApplicationPayload {
  id: number;
  jobId: number;
  seekerId: number;
  cvPath: string; // The path to the uploaded file on the server
  status : string;
  applied_at: string;
}

export interface IncomingCreateApplicationResponse {
  message: string;
  application: IncomingApplicationPayload;
}

export interface IncomingApplicationsResponse {
  message: string;
  applications: IncomingApplicationPayload[];
}

// You might also have a type for the data you send to the API
export interface OutgoingApplicationPayload {
  jobId: number;
  seekerId: number;
  cvFile: File;
}

export interface IncomingSeekerApplicationsResponse {
  message: string;
  applications: IncomingSeekerApplicationPayload[];
}

export interface IncomingSeekerApplicationPayload {
  application_id: number;
  job_id : number;
  job_title: string;
  status: string;
  cv_url: string; // The path to the uploaded file on the server
  applied_date: string;
}
