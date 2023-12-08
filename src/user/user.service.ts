import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepo : Repository<User>
  ) {}

    //회원가입
    async createU(c:CreateUserDto) {
      const newuser = await this.userRepo.create(c)
      await this.userRepo.save(newuser)
      return newuser
    }


    // email로 찾기
    async findUserByEmail(email: string) {
      const founduser = await this.userRepo.findOneBy({email})
      if (!founduser) throw new HttpException('not found', HttpStatus.BAD_REQUEST)
      return founduser
    }

    // id로 찾기
    async findUserById(id: string) {
      const founduser = await this.userRepo.findOneBy({id})
      if (!founduser) throw new HttpException('not found', HttpStatus.BAD_REQUEST)
      return founduser
    }


}
