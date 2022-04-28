import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { forkJoin, map, Observable } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { ChipService } from '../core/chip.service';
import { UserService } from '../core/user.service';
import { Chip } from '../domain/chip';
import { Project } from '../domain/projects';
import { User } from '../domain/user';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  public creator?: Observable<User>;
  projectChips!: Observable<{chip: Chip, amount: number}[]>;
  chipDisplayedColumns: string[] = ['code', 'name', 'amount'];

  constructor(
    public dialogRef: MatDialogRef<ProjectDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public project: Project,
    public auth: AuthService,
    private userService: UserService,
    private chipService: ChipService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getCreator();
    this.projectChips = forkJoin(this.project.chips.map((chipAmount) =>
      this.chipService.getChip(chipAmount.chip)
        .pipe(map((chip) => ({chip, amount: chipAmount.amount})))
    ));
  }

  getCreator(): void {
    if (this.project.creator)
      this.creator = this.userService.getUser(this.project.creator)
  }

  openEditor() {
    this.dialogRef.close();
    this.router.navigate(["/project/editor", this.project._id]);
  }

}
