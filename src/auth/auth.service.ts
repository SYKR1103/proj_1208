import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import {ConfigService}  from '@nestjs/config'
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { TokenPayloadInterface } from './interfaces/tokenPayload.interface';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { Inject } from '@nestjs/common';
import {CACHE_MANAGER} from '@nestjs/cache-manager'
import {Cache} from "cache-manager"
import { EmailCheckDto } from './dto/email-check.dto';
import {HttpException, HttpStatus} from '@nestjs/common'

@Injectable()
export class AuthService {

  constructor(
    private readonly userService : UserService,
    private readonly configService : ConfigService, 
    private readonly jwtService : JwtService,
    private readonly emailService : EmailService,
    @Inject(CACHE_MANAGER) private cacheManager : Cache

  ) {}

  async createU(c:CreateUserDto) {
    return await this.userService.createU(c)
  }

  //로그인
  async loginU(l:LoginUserDto) {
    const user = await this.userService.findUserByEmail(l.email)
    const isMatched = await user.checkPassword(l.password)
    if (!isMatched) throw new InternalServerErrorException()
    return user
  }


  //토큰발행
  public generateAccessToken(userId : string) {

      const payload : TokenPayloadInterface  = {userId}
      const token = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: `${this.configService.get(
          'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
        )}`,   
      })
      return token
  }

  
  
  //이메일인증
  async emailverification(email:string) {
    const vercode = this.generateOTP()
    await this.cacheManager.set(email,vercode)
    await this.emailService.sendMail({
      to : email,
      subject : 'emailverification',
      text : `verification code is ${vercode}`
    })
    return "success"
  }

  //이메일인증체크
  async emailcheck(emailcheckdto : EmailCheckDto) {
    const ori_con = await this.cacheManager.get(emailcheckdto.email)
    if (ori_con != emailcheckdto.code) throw new HttpException('NOT MATCHED', HttpStatus.NOT_FOUND)
    return true
  }

  generateOTP() {
    let OTP = '';
    for (let i=1; i<=6;i++) {
      OTP += Math.floor(Math.random()*10)
    }
    return OTP
  }



}
