import { Component, OnInit, ViewChild } from '@angular/core';
 
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { DynamicServices } from '../../services/dynamic.service';
import { SharedService } from '../../services/shared.service';
import { StorageService } from '../../services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataMediaterService } from '../../services/data-mediater.service';
import { Constant } from '../../shared/constant';
import { MenuMaster, UserMaster } from '../../models/user';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  isShowAllUser: boolean = true;
  userDetailFg: FormGroup;
  permissionGrp: FormGroup;
  formArray: FormArray;
  submitted = false;
  isLinear = true;
  menuList: MenuMaster[];
  userList: UserMaster[];
  selectedUser: UserMaster = null;

  displayedColumns = ['id', 'fullName', 'phoneNo', 'email', 'validTill', 'edit'];
  dataSource = []; 
  isSuperAdmin: boolean;

  constructor(private formBuilder: FormBuilder,
    private service: DynamicServices,
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private mediaterService: DataMediaterService,
    private storageService: StorageService) {

  }

  ngOnInit() {  
    this.isSuperAdmin = this.storageService.getUser().isSuperAdmin;
    this.userDetailFg = this.formBuilder.group({
      fullName: ['', Validators.required],
      phoneNumber: ['',[Validators.required,Validators.pattern(/^[6-9]\d{9}$/)]],
      emailId: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: [''],
      panNo: [''],
      userName: ['', [Validators.required]],

    });


    this.permissionGrp = this.formBuilder.group({
      reportViewFrDate: [new Date(), [Validators.required]],
      validTill: [new Date(), [Validators.required]],
      tablePermission: true,
      recordSheetPerm: true,
      resultOutPerm: true,
      dataSumaryReportPerm: true,
      tbBtReportPerm: true,
      otReportPerm: true,
      mstReportPerm:true,
      ddReportPerm: true,
      aocReportPerm: true
    });

    // this.userDetailFg.controls['reportViewFrDate'].setValue('2011-01-01');
    // this.userDetailFg.controls['validTill'].setValue('01-01-2000');
    this.getAllUser();
  }

  getAllUser():void{
    this.service.getEntities(Constant.GET_ALL_USER).subscribe(resp => {
      this.userList = resp.data;
      this.userList = this.userList.sort((a, b) => a.fullName.localeCompare(b.fullName))
      this.dataSource = this.userList;
    });

  }

  showAllUser(isShowAll) {
    if (!isShowAll) {
      this.userDetailFg.reset();
    }
    else
      this.selectedUser = null;

    this.isShowAllUser = isShowAll;
    if (isShowAll)
      this.selectedUser = null;
  }

  editUser(id) {
    if (!id) return;
    this.service.getByPost(Constant.GET_USER_BY_ID, { id: id })
      .subscribe(resp => {
        if (resp.status === 200) {
          this.selectedUser = resp.data;
          this.isShowAllUser = false;
          this.userDetailFg.patchValue(this.selectedUser);
          this.permissionGrp.patchValue(this.selectedUser);
        }
      });
  }

  saveUser() {
    var user = this.selectedUser;
    if (!user || !user.id) {
      user = {} as UserMaster;
      Object.keys(this.userDetailFg.value)
            .forEach(key => user[key] = null);

      Object.keys(this.permissionGrp.value)
            .forEach(key => user[key] = null); 
    }

    Object.keys(this.userDetailFg.value)
      .forEach(key => key in user ? user[key] = this.userDetailFg.value[key] : null);

    Object.keys(this.permissionGrp.value)
      .forEach(key => key in user ? user[key] = this.permissionGrp.value[key] : null);

    this.service.getByPost(Constant.SAVE_USER, user)
      .subscribe((response) => {
        if (!response) {
          return this.sharedService.openSnackBar("OOPS!, Some error has occured, Please try after some time", "OK", 10);
        }
        if (response && response.status === 200) {
          return this.sharedService.openSnackBar("Save successfully", "OK", 10);
        }

        if (response && response.status == 400) {
          return this.sharedService.openSnackBar("No User is selected or posted for save", "OK", 10);
        }

        if (response && response.status == 500) {
          return this.sharedService.openSnackBar("OOPS!, Some error has occured, Please try after some time", "OK", 10);
        }
        this.getAllUser(); 

      });
  } 
}
