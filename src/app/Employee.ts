import {FieldState, MaybeFieldTree} from "@angular/forms/signals";
//import {EmployeeSkill} from "./EmployeeSkill";

export interface Skill {
  id: number;
  postcode: string;
  skill: string;
  // firstName: string;
  // lastName: string;
  // street: string;
  // postcode: number;
  // city: string;
  // phone: string;
}

//
// export class Employee {
//   constructor(
//     public id?: number,
//     public lastName?: string,
//     public firstName?: string,
//     public street?: string,
//     public postcode?: string,
//     public city?: string,
//     public phone?: string,
//     public skillSet: Skill[] = []// skills oder Qualifications
//   ) {
//   }
// }

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  street?: string;
  postcode?: string;
  city?: string;
  phone?: string;
  skillSet: Skill[];
  avatarUrl?: string;
}


export interface EmployeeFormModel {
  firstName: string;
  lastName: string;
  street: string;
  postcode: string;
  city: string;
  phone: string;
  skillSet: Skill[];
}

export const initialData: EmployeeFormModel = {

  skillSet: [],
  firstName: '',
  lastName: '',
  street: '',
  postcode: '',
  city: '',
  phone: ''
};

export class EmployeeModel {
  constructor(
    public id?: number,
    public lastName?: string,
    public firstName?: string,
    public street?: string,
    public postcode?: string,
    public city?: string,
    public phone?: string,
    public skillSet: Skill[] = []
  ) {}
}
