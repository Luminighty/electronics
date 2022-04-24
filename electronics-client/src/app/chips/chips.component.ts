import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { ChipDetailsComponent } from '../chip-details/chip-details.component';
import { AuthService } from '../core/auth.service';
import { ChipService } from '../core/chip.service';
import { Chip } from '../domain/chip';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss']
})
export class ChipsComponent implements OnInit {
  displayedColumns: string[] = ["code", "name", "creator"];

  dataSource!: MatTableDataSource<Chip>;
  chips!: Observable<Chip[]>;
  isAdmin!: boolean;

  constructor(
    private chipService: ChipService,
    private auth: AuthService,
    private dialog: MatDialog,
  ) { }

  async ngOnInit(): Promise<void> {
    this.getChips();
    this.isAdmin = this.auth.isAdmin;
  }

  async deleteChip(chip: Chip): Promise<void> {
    await this.chipService.deleteChip(chip);
    this.getChips();
  }

  private getChips(): void {
    this.chips = this.chipService.getChips();
  }

  viewDetails(data: Chip): void {
    this.dialog.open(ChipDetailsComponent, {data});
  }

}
