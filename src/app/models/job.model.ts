export interface IncomingJobPayload {
  id?: number;
  title: string;
  description: string;
  salary?: number;
  location: string;
  employer_id: number;
  created_at?: Date;
}

export interface IncomingGetJobsResult {
  message : string;
  jobs: IncomingJobPayload[]
}

export interface IncomingCreateOrUpdateJobResult {
  message : string;
  job: IncomingJobPayload
}

export interface OutgoingJobPayload {
  title: string ;
  description: string ;
  salary?: number ;
  location: string ;
}

export interface UpdateJobPayload {
  jobUpdate: {
    title: string;
    description: string;
    salary?: number;
    location: string;
  };
  id: number;
  employer_id: number;
}
