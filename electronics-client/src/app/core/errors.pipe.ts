import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Pipe({
  name: 'appErrors'
})
export class ErrorsPipe implements PipeTransform {
  transform(value: ValidationErrors): string {
    if (value["required"]) {
      return 'This field is required.';
    }
    if (value["minlength"]) {
      return `Title must be at least
        ${value["minlength"]["requiredLength"]} characters long.`;
    }
    if (value["url"]) {
      return `This field must be a URL`;
    }
    return JSON.stringify(value);
  }

}
