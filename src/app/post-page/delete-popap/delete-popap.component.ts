import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-delete-popap',
  templateUrl: './delete-popap.component.html',
  styleUrls: ['./delete-popap.component.less']
})
export class DeletePopapComponent {

  constructor(
    public dialogRef: MatDialogRef<DeletePopapComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
