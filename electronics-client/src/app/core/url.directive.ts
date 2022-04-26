import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function URL(allowNull: boolean = true): ValidatorFn {
  const reg = new RegExp("(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?");
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value && allowNull)
      return null;
    const forbidden = reg.test(control.value);
    return forbidden ? null : {url: {value: control.value}};
  };
}
