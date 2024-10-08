import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrls: ['./confirm-delete-dialog.component.css']
})
export class ConfirmDeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {employeeName: string}
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true); // Pass true to indicate confirmation
  }

  onCancel(): void {
    this.dialogRef.close(false); // Pass false to indicate cancellation
  }
}
