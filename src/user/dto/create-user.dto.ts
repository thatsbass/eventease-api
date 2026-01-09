import { IsEmail, IsEnum, IsString } from "class-validator";
import { Roles } from "src/common/constants/roles.constant";

export class CreateUserDto {
    @IsString()
    password: string;
    @IsEmail()
    email: string;
    @IsString()
    fullName: string;
    @IsString()
    phone: string;
    @IsString()
    @IsEnum(Roles)
    role : Roles;
}
