import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Observable, switchMap } from 'rxjs';
import { ChipService } from '../core/chip.service';
import { URL } from '../core/url.directive';
import { Chip } from '../domain/chip';

@Component({
  selector: 'app-chip-editor',
  templateUrl: './chip-editor.component.html',
  styleUrls: ['./chip-editor.component.scss']
})
export class ChipEditorComponent implements OnInit {

  chipToEdit?: Observable<Chip | null>;
  editId?: string;

  form: FormGroup = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(2)]],
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    datasheet: ['', [URL()]],
    pins: this.fb.array([]),
  });

  get title(): string {
    return this.editId ? "Edit Chip" : "New Chip";
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private chipService: ChipService,
  ) { }

  ngOnInit(): void {
    this.chipToEdit = this.route.paramMap.pipe(switchMap(params => {
      const id = params.get("id");
      if (id && id !== "new")
        return this.chipService.getChip(id);
      return EMPTY;
    }));
    this.chipToEdit.subscribe((chip) => {
      this.editId = chip?._id;
      this.updateFormFields(chip);
    })
  }

  updateFormFields(chip: Chip | null) {
    if (chip == null)
      return;
    this.form.reset({
      code: chip.code,
      name: chip.name,
      description: chip.description,
      datasheet: chip.datasheet,
    })
    chip.pins.forEach(this.addPin.bind(this))
  }

  submit(): void {
    this.form.markAllAsTouched();

    const chipValue = {
      ...this.form.value,
      pins: this.pinLabels
    }

    let observable: Observable<Chip>;
    if(this.editId == null) {
      observable = this.chipService.createChip(chipValue);
    } else {
      observable = this.chipService.editChip(this.editId, chipValue);
    }
    observable.subscribe((res) => {
      this.router.navigate(['/chip']);
    })
  }

  get code(): FormControl {
    return this.form.get('code') as FormControl;
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get datasheet(): FormControl {
    return this.form.get('datasheet') as FormControl;
  }

  get description(): FormControl {
    return this.form.get('description') as FormControl;
  }

  get pins(): FormArray {
    return this.form.get("pins") as FormArray;
  }

  addPin(value='') {
    const pinForm = this.fb.group({
      value: [value]
    });
    this.pins.push(pinForm);
    console.log(this.pinLabels);
  }

  deletePin(index: number) {
    this.pins.removeAt(index);
  }

  get pinLabels(): string[] {
    return this.pins.value.map((control: FormControl) => {
      return control.value;
    })
  }

}
