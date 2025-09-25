import { IsString, IsNotEmpty, IsEmail, IsOptional, IsIn } from 'class-validator';

export class AdministratorDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsIn(['administrator'])
    role: string = 'administrator';

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    imageURL?: string;
}
