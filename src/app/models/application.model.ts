export interface IncomingApplicationPayload {
  id: number;
  job_id: number;
  seekerId: number;
  cvPath: string; // The path to the uploaded file on the server
  createdAt: string;
}

export interface IncomingApplicationResponse {
  message: string;
  application: IncomingApplicationPayload
}

export interface IncomingApplicationsResponse {
  message: string;
  applications: IncomingApplicationPayload
}


// You might also have a type for the data you send to the API
export interface OutgoingApplicationPayload {
  jobId: number;
  seekerId: number;
  cvFile: File;
}
