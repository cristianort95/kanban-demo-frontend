import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {validateActionRules} from "../../../core/guards/auth.guard";
import {Router, RouterStateSnapshot} from "@angular/router";

@Directive({
  selector: '[appValidateActionButton]',
  standalone: true
})
export class ValidateActionButtonDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private router: Router
  ) {}

  @Input() set appValidateActionButton(action: string) {
    if (validateActionRules(this.router.url, action)) this.viewContainer.createEmbeddedView(this.templateRef);
    else this.viewContainer.clear();
  }
}
