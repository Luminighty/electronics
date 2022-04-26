import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Observable, switchMap } from 'rxjs';
import { ProjectService } from '../core/project.service';
import { Chip } from '../domain/chip';
import { ChipAmount, Project } from '../domain/projects';

@Component({
  selector: 'app-project-editor',
  templateUrl: './project-editor.component.html',
  styleUrls: ['./project-editor.component.scss']
})
export class ProjectEditorComponent implements OnInit {
  projectToEdit?: Observable<Project | null>;
  editId?: string;

  form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    shortDescription: [''],
    description: [''],
    chips: this.fb.array([]),
  });

  get pageTitle(): string {
    return this.editId ? "Edit Project" : "New Project";
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
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
    })
  }

  updateFormFields(project: Project | null) {
    if (project == null)
      return;
    this.form.reset({
      title: project.title,
      shortDescription: project.shortDescription,
      description: project.description,
    })

  }


  submit() {
    this.form.markAllAsTouched();

    const projectValue = {
      ...this.form.value,
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

  get chips(): FormArray {
    return this.form.get("chips") as FormArray;
  }

  addChip(chip: Chip) {
    const values = this.chips.value;
    const index = values.findIndex((other: ChipAmount) => other.chip == chip._id);
    if (index != -1) {
      this.chips.value[index].amount++;
    } else {
      const chipForm = this.fb.group({
        amount: [1, Validators.required, Validators.min(0)],
        chip: [chip._id, Validators.required],
      });
      this.chips.push(chipForm);
    }
  }

  deleteChip(index: number) {
    this.chips.removeAt(index);
  }


}
