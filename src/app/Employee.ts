import {FieldState} from "@angular/forms/signals";

export class Employee {
  constructor(public id?: undefined,
              public lastName?: FieldState<string, string>,
              public firstName?: FieldState<string, string>,
              public street?: FieldState<string, string>,
              public postcode?: FieldState<string, string>,
              public city?: FieldState<string, string>,
              public phone?: FieldState<string, string>) {
  }
}
