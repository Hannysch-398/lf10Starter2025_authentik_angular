export interface Skill {
  id: number;
  skill: string;
  firstName: string;
  lastName: string;
  street: string;
  postcode: number;
  city: string;
  phone: string;


}

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
