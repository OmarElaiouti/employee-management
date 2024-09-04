import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { IEmployee } from '../models/employee.model';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
  employeeForm!: FormGroup;
  isSaving = false;

  constructor(private fb: FormBuilder, private employeeService: EmployeeService) { 
    
   }

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^01[0-2]\d{8}$/)]],
      address: ['', Validators.required]
    });
  }

  save(): void {
    if (this.employeeForm.valid) {
      this.isSaving = true;
      const employeeData = this.employeeForm.value;

      // Call your service to save data
      this.employeeService.addEmployee(employeeData).subscribe({
        next: () => {
          this.isSaving = false;
          // Close the popup and refresh the grid
        },
        error: () => {
          this.isSaving = false;
          // Handle error
        }
      });
    }
  }
  get f(): { [key: string]: AbstractControl } {
    return this.employeeForm.controls;
  }

}
