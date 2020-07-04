import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { SharedService } from '../services/shared.service';
import { Router } from '@angular/router';
import { UserMaster } from '../models/user';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;

  userName: string;
  password: string;

  constructor(private authService: AuthService,
    private router: Router,
    private storageService: StorageService,
    private shardService: SharedService) { }

  ngOnInit() {
    
  }

  authenticateUser(): void {
    this.authService.authenticateUser(this.userName, this.password)
      .subscribe(ent => {
        if (ent && ent.status === 200) {  
          this.storageService.addUser(ent.data);
          this.router.navigate([this.getUrl(ent.data)]);
          return;
        }

        if(ent && ent.status == 400){
          this.showMessage(ent.message); 
        } else if (ent && ent.status === 401) {
           this.showMessage(ent.message);
        } else {
          this.showMessage('Some error has encountered.');
        }
      });;
  }


  getUrl(user: UserMaster): string {
    if (user.dataSumaryReportPerm)
      return '/home/dataSummary';

    if (user.recordSheetPerm)
      return '/home/recordSheet';

    if (user.resultOutPerm)
      return '/home/actionItemTrade';

    if (user.tablePermission)
      return '/home/tableReport';

      if (user.tbBtReportPerm)
      return '/home/tbBtReport';
    return '';
  }

  showMessage(message) {
    this.shardService.openSnackBar(message, 'Ok', 8); 
  }
}
