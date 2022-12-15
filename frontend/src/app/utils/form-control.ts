import { AbstractControl } from '@angular/forms'

export function removeFormControlError (control: AbstractControl, errorName: string): void {
  if (control.errors !== null && control.hasError(errorName)) {
    delete control.errors?.[errorName]
    if (Object.keys(control.errors).length === 0) {
      control.setErrors(null)
    }
  }
}
