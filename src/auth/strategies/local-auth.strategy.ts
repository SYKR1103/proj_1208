import { Strategy } from "passport-local";
import { PassportStrategy} from '@nestjs/passport'
import { AuthService } from "../auth.service";
import { Injectable } from "@nestjs/common";
import { User } from "src/user/entities/user.entity";




@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy) {

    constructor(
        private readonly authService : AuthService
    ) {
        super({
            usernameField : 'email'
        })
    }

    async validate(email:string, password : string ) : Promise<User> {
        return await this.authService.loginU({email, password})
    }

}