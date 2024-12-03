import {Component, ViewChild} from '@angular/core';
import {FormComponent} from "../../shared/components/form/form.component";
import {FieldsFormGroup} from "../../core/models/FieldsFormGroup";
import {FormGroup, Validators} from "@angular/forms";
import {LOGIN, REGISTER} from "../../core/endpoints";
import {HttpErrorResponse} from "@angular/common/http";
import {NgxSpinnerService} from "ngx-spinner";
import {AuthServiceService} from "../../core/services/AuthService";
import {Router} from "@angular/router";
import {CrudService} from "../../core/services/CrudService";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.sass'
})
export class RegisterComponent {
  @ViewChild(FormComponent) child!: FormComponent
  constructor(
    readonly crud: CrudService,
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
    { name: "email", label: "Email", type: "input", validator: [Validators.required]},
    { name: "name", label: "Nombre", type: "input", validator: [Validators.required]},
    { name: "lastName", label: "Apellido", type: "input", validator: [Validators.required]},
    { name: "password", label: "Contraseña", type: "password", validator: [Validators.required]},
    { name: "phone", label: "Telefono", type: "input", validator: [Validators.required]},
  ]

  sendSubmit() {
    this.child.form.markAllAsTouched();
    this.child.onSubmit();
  }

  onSubmit(form: FormGroup) {
    if (form.valid) {
      this.spinner.show("create")
      this.crud.post(REGISTER, form.value).subscribe((response: any) => {
        this.spinner.hide("create")
        form.reset()
      }, (error: HttpErrorResponse) => {
        this.spinner.hide("create")
      })
    }
  }
}
