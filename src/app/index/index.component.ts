import { Component, ViewChild } from '@angular/core';
import { IEmployee } from '../models/employee.model';
import { EmployeeService } from '../services/employee-service/employee.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { AuthService } from '../services/auth-services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditEmployeeComponent } from '../edit-employee/edit-employee.component';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent {
  dataSource = new MatTableDataSource<IEmployee>();
  totalEmployees = 0;
  selectedEmployeeIds: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private authService: AuthService, 
    private router: Router
  ) {}
  


  ngAfterViewInit() {
    this.loadEmployees()
    this.paginator.page.subscribe(() => this.loadEmployees());
  }

  loadEmployees(): void {
    const pageIndex = this.paginator.pageIndex + 1;
    const pageSize = this.paginator.pageSize;

    this.employeeService.getEmployees(pageIndex, pageSize).subscribe({
      next: (data: any) => {
        this.dataSource.data = data.items;
        this.totalEmployees = data.totalCount;
        this.paginator.length = this.totalEmployees;
      },
      error: (err) => console.log('Error fetching employees')
    });
  }

 

  openAddEmployeeModal(): void {
    const modalRef = this.dialog.open(AddEmployeeComponent, {
      width: '400px', 
      disableClose: false,  
      hasBackdrop: true,  
    });

    modalRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        this.loadEmployees();
      }
    }, error => {
      console.log('Modal dismissed');
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
      console.log('Modal dismissed');
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
      error: (err) => console.log('Error deleting employee')
    });
  }

  deleteSelectedEmployees(): void {
    this.employeeService.deleteRange(this.selectedEmployeeIds).subscribe({
      next: () => {
        console.log('Selected employees deleted successfully');
        this.loadEmployees();
        this.selectedEmployeeIds = []; 
      },
      error: (err) => console.log('Error deleting employees')
    });
  }

  selectAll(event: any): void {
    const checked = event.target.checked;

    if (checked) {
      this.selectedEmployeeIds = this.dataSource.data.map(emp => emp.id);
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

  anyValidEmployee(): boolean {
    return this.dataSource.data.length > 0;
  }

  isAllSelected(): boolean {
    return this.selectedEmployeeIds.length === this.dataSource.data.length && this.dataSource.data.length > 0;
  }

  logout() {
    this.authService.clearTokens(); 
    this.router.navigate(['/']); 
  }

}
