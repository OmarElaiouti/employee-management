import { Component } from '@angular/core';
import { IEmployee } from '../models/employee.model';
import { EmployeeService } from '../services/employee-service/employee.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { AuthService } from '../services/auth-services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditEmployeeComponent } from '../edit-employee/edit-employee.component';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent {
  employees: IEmployee[] = [];
  selectedEmployeeIds: string [] = [];
  totalEmployees = 0;

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private authService: AuthService, 
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.totalEmployees = employees.length;
        
      },
      error: (err) => console.error('Error fetching employees:', err)
    });
  }

  openAddEmployeeModal(): void {
    const modalRef = this.dialog.open(AddEmployeeComponent, {
      width: '400px', 
      disableClose: false,  
      hasBackdrop: true,  
      panelClass: 'custom-dialog-container'  
    });

    modalRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        this.loadEmployees();
      }
    }, error => {
      console.error('Modal dismissed:', error);
    });
  }

  openEditEmployeeModal(employee: IEmployee): void {
    const modalRef = this.dialog.open(EditEmployeeComponent, {
      width: '400px',
      disableClose: false,
      hasBackdrop: true,
      panelClass: 'custom-dialog-container',
      data: { ...employee }  // Pass employee data to the modal
    });

    modalRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        this.loadEmployees();
      }
    }, error => {
      console.error('Modal dismissed:', error);
    });
  }

  openConfirmDeleteDialog(employee: IEmployee): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '300px',
      data: { employeeName: `the employee ${employee.name}`}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteEmployee(employee.id); 
      }
    });
  }

  openConfirmBulkDeleteDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '300px',
      data: { employeeName: `selected employees` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteSelectedEmployees();
      }
    });
  }

  deleteEmployee(employeeId: string): void {
    this.employeeService.deleteEmployee(employeeId).subscribe({
      next: () => {
        this.loadEmployees(); 
      },
      error: (err) => console.error('Error deleting employee:', err)
    });
  }

  deleteSelectedEmployees(): void {
    this.employeeService.deleteRange(this.selectedEmployeeIds).subscribe({
      next: () => {
        console.log('Selected employees deleted successfully');
        this.loadEmployees();
        this.selectedEmployeeIds = []; 
      },
      error: (err) => console.error('Error deleting employees:', err)
    });
  }

  selectAll(event: any): void {
    const checked = event.target.checked;
  
    if (checked) {
      this.selectedEmployeeIds = this.employees.map(emp => emp.id);
    } else {
      this.selectedEmployeeIds = [];
    }
  }

  toggleSelection(employeeId: string): void {
    if (this.selectedEmployeeIds.includes(employeeId)) {
      this.selectedEmployeeIds = this.selectedEmployeeIds.filter(id => id !== employeeId);
    } else {
      this.selectedEmployeeIds.push(employeeId);
    }
  }

  isSelected(employeeId: string): boolean {
    return this.selectedEmployeeIds.includes(employeeId);
  }

  isAllSelected(): boolean {
    return this.selectedEmployeeIds.length === this.employees.length && this.employees.length > 0;
  }

  logout() {
    this.authService.clearTokens(); 
    this.router.navigate(['/']); 
  }

}
