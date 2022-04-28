import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, forkJoin, map, Observable, switchMap } from 'rxjs';
import { ChipService } from '../core/chip.service';
import { ProjectService } from '../core/project.service';
import { Chip } from '../domain/chip';
import { Project } from '../domain/projects';

interface ChipAmount {
  amount: number,
  chip: Chip,
}

@Component({
  selector: 'app-project-editor',
  templateUrl: './project-editor.component.html',
  styleUrls: ['./project-editor.component.scss']
})
export class ProjectEditorComponent implements OnInit {
  projectToEdit?: Observable<Project | null>;
  editId?: string;
  projectChipColumns = ['code', 'name', 'amount'];
  chips!: ChipAmount[];

  form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    shortDescription: [''],
    description: [''],
  });

  get pageTitle(): string {
    return this.editId ? "Edit Project" : "New Project";
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private chipService: ChipService,
    private snackbar: MatSnackBar,
  ) { }


  ngOnInit(): void {
    this.projectToEdit = this.route.paramMap.pipe(switchMap(params => {
      const id = params.get("id");
      if (id && id !== "new")
        return this.projectService.getProject(id);
      return EMPTY;
    }));
    this.projectToEdit.subscribe((project) => {
      this.editId = project?._id;
      this.updateFormFields(project);
    });
  }

  updateFormFields(project: Project | null) {
    if (project == null)
      return;
    this.form.reset({
      title: project.title,
      shortDescription: project.shortDescription,
      description: project.description,
    })

    forkJoin(project.chips
      .map((chipAmount) =>
        this.chipService.getChip(chipAmount.chip)
        .pipe(map((chip) => ({chip, amount: chipAmount.amount}))))
    ).subscribe((chips) => this.chips = chips);
  }

  submit() {
    this.form.markAllAsTouched();

    const projectValue = {
      ...this.form.value,
      chips: this.chips.map((chipAmount) => ({amount: chipAmount.amount, chip: chipAmount.chip._id}))
    }
    console.log(projectValue);

    let observable: Observable<Project>;
    if(this.editId == null) {
      observable = this.projectService.createProject(projectValue);
    } else {
      observable = this.projectService.editProject(this.editId, projectValue);
    }
    observable.subscribe({
      complete: () => this.router.navigate(['/project']),
      error: (error) => this.snackbar.open("Project couldn't be created!", "Close", {duration: 3000}),
    });
  }

  get title(): FormControl {
    return this.form.get("title") as FormControl;
  }
  get shortDescription(): FormControl {
    return this.form.get("shortDescription") as FormControl;
  }
  get description(): FormControl {
    return this.form.get("description") as FormControl;
  }

  deleteChip(chipId: string) {
    this.projectService.setChips(this.editId || "", chipId, 0)
      .subscribe(() => {
        this.ngOnInit();
        this.snackbar.open("Chip removed from project", "Close", {duration: 3000})
      });
  }


}
