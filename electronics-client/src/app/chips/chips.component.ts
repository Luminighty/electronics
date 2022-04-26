import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { EMPTY, Observable } from 'rxjs';
import { ChipDetailsComponent } from '../chip-details/chip-details.component';
import { AuthService } from '../core/auth.service';
import { ChipService } from '../core/chip.service';
import { UserService } from '../core/user.service';
import { Chip } from '../domain/chip';
import { User } from '../domain/user';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss']
})
export class ChipsComponent implements OnInit {
  displayedColumns: string[] = ["code", "name", "creator"];

  chips!: Observable<Chip[]>;
  isAdmin!: boolean;

  creators: {[key: string]: Observable<User>} = {};

  constructor(
    private chipService: ChipService,
    public auth: AuthService,
    private userService: UserService,
    private dialog: MatDialog,
  ) { }

  async ngOnInit(): Promise<void> {
    this.getChips();
    this.isAdmin = this.auth.isAdmin;
  }

  async deleteChip(chip: Chip): Promise<void> {
    this.chipService.deleteChip(chip);
    this.getChips();
  }

  private getChips(): void {
    this.chips = this.chipService.getChips();
  }

  viewDetails(data: Chip): void {
    this.dialog.open(ChipDetailsComponent, {data});
  }

  getCreator(chip: Chip): Observable<User> {
    if (!chip.creator)
      return EMPTY;
    return this.userService.getUser(chip.creator);
  }

}
