import { ErrorInterceptor } from './http/error.interceptor';
import { HttpClientModule } from './http/httpclient.module';
import { TranslateCoreModule } from './translate-core.module';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injector, NgModule, Optional, SkipSelf } from '@angular/core';

@NgModule({
  imports: [CommonModule, HttpClientModule, TranslateCoreModule],
  declarations: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
  exports: [HttpClientModule],
})
export class CoreModule {
  constructor(
    private injector: Injector,
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded.');
    }
  }
}
