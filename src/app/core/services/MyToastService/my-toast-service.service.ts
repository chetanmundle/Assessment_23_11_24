import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class MyToastServiceService {
  private toastr = inject(ToastrService);

  showSuccess(msg: string) {
    this.toastr.success(`${msg}`, '', {
      closeButton: true,
    });
  }
  showError(msg: string) {
    this.toastr.error(`${msg}`, '', {
      closeButton: true,
    });
  }
  showWarning(msg: string) {
    this.toastr.warning(`${msg}`, '', {
      closeButton: true,
    });
  }
}
