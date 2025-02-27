import {Component, ViewChild} from '@angular/core';
import {FormComponent} from "../../shared/components/form/form.component";
import {FieldsFormGroup} from "../../core/models/FieldsFormGroup";
import {FormGroup, Validators} from "@angular/forms";
import {LOGIN} from "../../core/endpoints";
import {HttpErrorResponse} from "@angular/common/http";
import {NgxSpinnerService} from "ngx-spinner";
import {AuthServiceService} from "../../core/services/AuthService";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass'
})
export class LoginComponent {
  @ViewChild(FormComponent) child!: FormComponent
  constructor(
    readonly service: AuthServiceService,
    readonly spinner: NgxSpinnerService,
    readonly router: Router,
  ) {
    if (typeof window !== 'undefined') {
      const isAuthenticated = localStorage.getItem('authToken');
      if (isAuthenticated) {
        router.navigate(['/']).then();
      }
    }
  }

  fields: FieldsFormGroup[] = [
    { name: "username", label: "Usuario", type: "input", validator: [Validators.required]},
    { name: "password", label: "Contraseña", type: "password", validator: [Validators.required]},
  ]

  sendSubmit() {
    this.child.form.markAllAsTouched();
    this.child.onSubmit();
  }

  onSubmit(form: FormGroup) {
    if (form.valid) {
      this.spinner.show("create").then()
      this.service.login(form.value.username, form.value.password)
        .subscribe(
          (result: boolean) => {
            if (result) {
              form.reset()
              this.spinner.hide("create").then()
              this.router.navigate(["/"]);
            } else
              this.spinner.hide("create").then()
          }
        )
    }
  }
}
