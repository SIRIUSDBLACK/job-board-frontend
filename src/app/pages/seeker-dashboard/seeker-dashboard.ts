import { Component } from '@angular/core';
import { SeekerJobList } from "../../components/seeker-job-list/seeker-job-list";

@Component({
  selector: 'app-seeker-dashboard',
  imports: [SeekerJobList],
  templateUrl: './seeker-dashboard.html',
  styleUrl: './seeker-dashboard.scss'
})
export class SeekerDashboard {

}
