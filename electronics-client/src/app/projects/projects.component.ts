import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { EMPTY, Observable } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { ProjectService } from '../core/project.service';
import { UserService } from '../core/user.service';
import { Project } from '../domain/projects';
import { User } from '../domain/user';
import { ProjectDetailsComponent } from '../project-details/project-details.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  displayedColumns: string[] = ["title", "shortDescription", "creator"];

  projects!: Observable<Project[]>;
  isAdmin!: boolean;

  constructor(
    private projectService: ProjectService,
    public auth: AuthService,
    private userService: UserService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getProjects();
    this.isAdmin = this.auth.isAdmin;
  }

  private getProjects(): void {
    this.projects = this.projectService.getProjects();
  }

  viewDetails(data: Project): void {
    this.dialog.open(ProjectDetailsComponent, {data});
  }

  getCreator(chip: Project): Observable<User> {
    if (!chip.creator)
      return EMPTY;
    return this.userService.getUser(chip.creator);
  }
}
