import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../services/employee-service/employee.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IEmployee } from '../models/employee.model';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent {
  employeeForm: FormGroup;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private dialogRef: MatDialogRef<EditEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public employee: IEmployee
  ) {
    this.employeeForm = this.fb.group({
      name: [employee.name, Validators.required],
      email: [employee.email, [Validators.required, Validators.email]],
      address: [employee.address, Validators.required],
      phone: [employee.phone, [Validators.required, Validators.pattern(/^01[0-2]\d{8}$/)]]
    });
  }

  get f() {
    return this.employeeForm.controls;
  }

  updateEmployee(): void {

    if (this.employeeForm.valid) {
      this.isSaving = true;
      const updatedEmployee:IEmployee = { ...this.employee, ...this.employeeForm.value };
      this.employeeService.editEmployee(updatedEmployee).subscribe({
        next: (response) => {
          this.dialogRef.close('saved');
        },
        error: (err) => {
          console.log('Error updating employee:', err);
        },
        complete: () => {
          this.isSaving = false;
        }
      });
    }
    else{
      console.log("Hello");
      
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
