import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { Chip } from '../domain/chip';

@Component({
  selector: 'app-chip-details',
  templateUrl: './chip-details.component.html',
  styleUrls: ['./chip-details.component.scss']
})
export class ChipDetailsComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ChipDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public chip: Chip,
    public auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    console.log(this.auth.user);
  }

  openEditor() {
    this.dialogRef.close();
    this.router.navigate(["/chip/editor", this.chip._id]);
  }

}
