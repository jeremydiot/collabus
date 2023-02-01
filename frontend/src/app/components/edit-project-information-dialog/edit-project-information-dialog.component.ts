import { Component, Inject, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ToastrService } from 'ngx-toastr'
import { Subscription } from 'rxjs'
import { ProjectKind } from 'src/app/enums'
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
    kind: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    isClosed: new FormControl<boolean>(false, { nonNullable: true, validators: [Validators.required] }),
    isHidden: new FormControl<boolean>(false, { nonNullable: true, validators: [Validators.required] }),
    deadline: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  })

  routeSubscription!: Subscription
  kinds: Array<{ name: string, id: number }> = []

  constructor (
    public dialogRef: MatDialogRef<EditProjectInformationDialogComponent>,
    private readonly projectService: ProjectService,
    @Inject(MAT_DIALOG_DATA) public data: null | { projectId?: number },
    private readonly toaster: ToastrService
  ) {}

  ngOnInit (): void {
    Object.keys(ProjectKind).filter((k) => isNaN(k as any as number)).forEach((k) => this.kinds.push({ name: k, id: ProjectKind[k as keyof typeof ProjectKind] }))

    if (this.data?.projectId !== undefined) {
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
    if (this.formGroup.valid) {
      const deadline = new Date(this.formGroup.controls.deadline.value)
      const year = deadline.getFullYear()
      const month = ('0' + (deadline.getMonth() + 1).toString()).slice(-2)
      const day = ('0' + deadline.getDate().toString()).slice(-2)

      const formData = {
        idFolder: this.data?.projectId,
        name: this.formGroup.controls.name.value,
        description: this.formGroup.controls.description.value,
        note: '',
        kind: this.formGroup.controls.kind.value,
        isClosed: this.formGroup.controls.isClosed.value,
        isHidden: this.formGroup.controls.isHidden.value,
        deadline: `${year}-${month}-${day}`
      }

      if (formData.idFolder !== undefined) {
        this.projectService.updateProjectPrivate(
          formData.idFolder,
          formData.name,
          formData.description,
          formData.note,
          formData.kind,
          formData.isClosed,
          formData.isHidden,
          formData.deadline
        ).subscribe((project) => {
          this.ngOnInit()
          this.dialogRef.close(project)
          this.toaster.success('Informations mises à jours')
        })
      } else {
        this.projectService.createProjectPrivate(
          formData.name,
          formData.description,
          formData.note,
          formData.kind,
          formData.isClosed,
          formData.isHidden,
          formData.deadline
        ).subscribe((project) => {
          this.dialogRef.close(project)
          this.toaster.success(`Projet ${formData.name} créé`)
        })
      }
    }
  }

  onClose (): void {
    this.dialogRef.close()
  }
}
