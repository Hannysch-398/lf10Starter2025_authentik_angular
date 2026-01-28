import {FieldState, MaybeFieldTree} from "@angular/forms/signals";
//import {EmployeeSkill} from "./EmployeeSkill";

export interface Skill {
  id: number | null;
  postcode: string;
  skill: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  phone: string;


}

export const initialData: Skill = {
  id: null,
  skill: '',
  firstName: '',
  lastName: '',
  street: '',
  postcode: '',
  city: '',
  phone: ''
};

export class Employee {
  constructor(
    public id?: number,
    public lastName?: string,
    public firstName?: string,
    public street?: string,
    public postcode?: string,
    public city?: string,
    public phone?: string,
    public skillSet: Skill[] = []// skills oder Qualifications
  ) {
  }
}
