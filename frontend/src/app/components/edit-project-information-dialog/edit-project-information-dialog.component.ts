import { Component, Inject, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { ProjectService } from 'src/app/services/project.service'

@Component({
  selector: 'app-edit-project-information-dialog',
  templateUrl: './edit-project-information-dialog.component.html',
  styleUrls: ['./edit-project-information-dialog.component.scss']
})
export class EditProjectInformationDialogComponent implements OnInit {
  formGroup = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    kind: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required] }),
    isClosed: new FormControl<boolean>(false, { nonNullable: true, validators: [Validators.required] }),
    isHidden: new FormControl<boolean>(false, { nonNullable: true, validators: [Validators.required] }),
    deadline: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  })

  routeSubscription!: Subscription

  constructor (
    public dialogRef: MatDialogRef<EditProjectInformationDialogComponent>,
    private readonly projectService: ProjectService,
    @Inject(MAT_DIALOG_DATA) public data: { projectId?: number }
  ) {
  }

  ngOnInit (): void {
    if (this.data.projectId !== undefined) {
      const subscription = this.projectService.getProjectPrivate(this.data.projectId).subscribe((project) => {
        this.formGroup.controls.name.setValue(project.name)
        this.formGroup.controls.description.setValue(project.description)
        this.formGroup.controls.kind.setValue(project.kind)
        this.formGroup.controls.isClosed.setValue(project.is_closed)
        this.formGroup.controls.isHidden.setValue(project.is_hidden)
        this.formGroup.controls.deadline.setValue(project.deadline)

        subscription.unsubscribe()
      })
    }
  }

  onSubmit (): void {

  }

  onClose (): void {
    this.dialogRef.close()
  }
}
