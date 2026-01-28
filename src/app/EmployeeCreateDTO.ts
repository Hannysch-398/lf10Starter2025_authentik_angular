
export interface EmployeeCreateDto {

  firstName: string;
  lastName: string;
  street: string;
  postcode: string;
  city: string;
  phone: string;
}
export const initialData: EmployeeCreateDto = {
  firstName: '',
  lastName: '',
  street: '',
  postcode: '',
  city: '',
  phone: '',
}
