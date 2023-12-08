import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RequestWithUser } from './interfaces/requestWithUser';
import { EmailCheckDto } from './dto/email-check.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async createU(@Body() c:CreateUserDto) {
    return await this.authService.createU(c)
  }


  // @Post('/login')
  // async loginU(@Body() l:LoginUserDto) {
  //   return await this.authService.loginU(l)
  // }

  @UseGuards(LocalAuthGuard)
  @Post("/login")
  async loginU(@Req() r:RequestWithUser) {
    //request들어와서 기존의 login, checkpassword까지했으면 user 반환되니까
    const {user} =r
    const token = await this.authService.generateAccessToken(user.id)
    return {user, token}

  }


  @Post('email/send')
  async emailverification(@Body("email") email:string) {
    return await this.authService.emailverification(email)
  }

  @Post('email/check')
  async emailcheck(@Body() emailcheckdto : EmailCheckDto) {
    return await this.authService.emailcheck(emailcheckdto)
  }



}
