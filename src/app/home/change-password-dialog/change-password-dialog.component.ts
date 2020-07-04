import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserMaster } from '../../models/user';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { DynamicServices } from '../../services/dynamic.service';
import { Constant } from '../../shared/constant';
import { SharedService } from '../../services/shared.service';


export const passwordMatchValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
  if (formGroup.get('password').value === formGroup.get('password2').value)
    return null;
  else
    return {passwordMismatch: true};
}; 

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css']
})


export class ChangePasswordDialogComponent { 

  constructor(
    public dynamicService: DynamicServices,
    public sharedService: SharedService,
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder
    ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }


  minPw = 8;
  formGroup: FormGroup;
 

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(this.minPw)]],
      password2: ['', [Validators.required]]
    }, {validator: passwordMatchValidator});
  }

  /* Shorthands for form controls (used from within template) */
  get password() { return this.formGroup.get('password'); }
  get password2() { return this.formGroup.get('password2'); }

  /* Called on each input in either password field */
  onPasswordInput() {
    if (this.formGroup.hasError('passwordMismatch'))
      this.password2.setErrors([{'passwordMismatch': true}]);
    else
      this.password2.setErrors(null);
  }

  onSubmit(){ 
    let user = {
      id: this.data.id,
      newPassword : this.password.value
    } 


    this.dynamicService.getByPost(Constant.CHANGE_PASSWORD, user)
        .subscribe((resp)=>{
          if(resp && resp.status === 200){
            this.sharedService.openSnackBar("Password change successfully", 'Ok', 20);
          }else{
            this.sharedService.openSnackBar("Error in saving, Please try again after some time", 'Ok', 10); 
          }
          this.dialogRef.close();
        });

  }

}
