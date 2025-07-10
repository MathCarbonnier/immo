import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberWithSpacesPipe } from './pipes/number-with-spaces.pipe';
import { NumberWithSpacesDirective } from './directives/number-with-spaces.directive';

@NgModule({
  declarations: [
    NumberWithSpacesPipe,
    NumberWithSpacesDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NumberWithSpacesPipe,
    NumberWithSpacesDirective
  ]
})
export class SharedModule { }
