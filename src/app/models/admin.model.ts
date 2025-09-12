import { User } from "./user.model";

export interface IncomingAdminStatsResponse {
  message: string;
  TotalStats: IncomingTotalStats;
}

export interface IncomingTotalStats {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  jobsPerEmployer: JobsPerEmployer[];
  applicationsPerJob: ApplicationsPerJob[];
}

export interface BanDeleteRoleResponse {
  message  : string
} 

export interface IncomingUsersData {
  message : string,
  users : User[]
}

export interface JobsPerEmployer {
  employer_name: string;
  total_jobs: number;
}

export interface ApplicationsPerJob {
  job_title: string;
  total_applications: number;
}
