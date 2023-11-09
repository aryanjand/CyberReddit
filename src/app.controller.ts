import { Controller, Get, Redirect, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Redirect('threads')
  root() {
    return;
  }

  @Get('cyberpunk')
  @Render('cyberpunk')
  cyberpunk() {
    return;
  }
}
