import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { ProjectService } from '../core/project.service';
import { UserService } from '../core/user.service';
import { Chip } from '../domain/chip';
import { Project } from '../domain/projects';
import { User } from '../domain/user';

@Component({
  selector: 'app-chip-details',
  templateUrl: './chip-details.component.html',
  styleUrls: ['./chip-details.component.scss']
})
export class ChipDetailsComponent implements OnInit {

  public creator?: Observable<User>;
  selectedProject: string = "";
  chipAmount: number = 1;
  public userProjects?: Observable<Project[]>;

  constructor(
    public dialogRef: MatDialogRef<ChipDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public chip: Chip,
    public auth: AuthService,
    private userService: UserService,
    private projectService: ProjectService,
    private router: Router,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getCreator();
    if (this.auth.user._id) {
      this.userProjects = this.projectService.userProjects(this.auth.user._id);
      this.userProjects.subscribe((res: Project[]) => {
        this.selectedProject = res[0]._id || "";
      });
    }
  }

  getCreator(): void {
    if (this.chip.creator)
      this.creator = this.userService.getUser(this.chip.creator)
  }

  openEditor() {
    this.dialogRef.close();
    this.router.navigate(["/chip/editor", this.chip._id]);
  }

  addChipsToProject() {
    this.projectService.addChips(this.selectedProject, this.chip._id || "", this.chipAmount)
      .subscribe({
        complete: () => this.snackbar.open("Chips added!", "Close", {duration: 3000}),
      });
  }

}
