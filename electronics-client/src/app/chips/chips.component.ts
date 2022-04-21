import { Component, OnInit } from '@angular/core';


export interface ChipElement {
  code: string;
  name: string;
  datasheet?: string;
  creator?: string;
}

const ELEMENT_DATA: ChipElement[] = [
  {code: "NE555", name: "Single Timer", datasheet: "https://www.hestore.hu/prod_getfile.php?id=15"},
  {code: "DDF0", name: "Duel Disk Field v0", creator: "Luminight"},
]

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss']
})
export class ChipsComponent implements OnInit {
  displayedColumns: string[] = ["code", "name", "datasheet", "creator"];
  chips = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}
