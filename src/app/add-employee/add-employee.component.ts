import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../services/employee-service/employee.service';
import { IEmployee } from '../models/employee.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
  employeeForm!: FormGroup;
  isSaving = false;

  constructor(
    private fb: FormBuilder, 
    private employeeService: EmployeeService,
    private dialogRef: MatDialogRef<AddEmployeeComponent>) { 
    
   }

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^01[0-2]\d{8}$/)]],
      address: ['', Validators.required]
    });
  }

  save(): void {
    if (this.employeeForm.valid) {
      this.isSaving = true;
      const employeeData = this.employeeForm.value;

      this.employeeService.addEmployee(employeeData).subscribe({
        next: () => {
          this.isSaving = false;
        this.employeeForm.reset();
        this.dialogRef.close('saved');
        },
        error: () => {
          this.isSaving = false;
        }
      });
    }
  }
  get f(): { [key: string]: AbstractControl } {
    return this.employeeForm.controls;
  }

  close() {
    this.dialogRef.close();
  }
}
