import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { AlertComponent } from './components/alert/alert.component';
import {CommonModule} from '@angular/common';


@NgModule({
    imports: [HttpClientModule, CommonModule],
  exports: [HttpClientModule, AlertComponent],
  declarations: [AlertComponent]
})
export class SharedModule {

}
