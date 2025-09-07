import { IsString, MinLength, MaxLength, IsNotEmpty, IsEmail, Matches, IsIn, IsOptional } from 'class-validator';

export class AdminDto {
    @IsString()
    @IsOptional()
    imageURL?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    city?: string;

    @IsString()
    @IsOptional()
    country?: string;

    @IsString()
    @IsOptional()
    dateOfBirth?: Date;
  
    @IsString()
    @IsNotEmpty({ message: 'Username cannot be empty' })
    @MaxLength(100)
    username: string;

    @IsString()
    @IsNotEmpty({ message: 'Full name cannot be empty' })
    @MaxLength(150)
    fullName: string;

    @IsString()
    @IsNotEmpty({ message: 'Password cannot be empty' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @Matches(/^(?=.*[A-Z]).+$/, { message: 'Password must contain at least one uppercase character' })
    password: string;

    @IsEmail({}, { message: 'Email must be a valid email address' })
    @Matches(/^[\w.-]+@gmail\.com$/, { message: 'Email must contain gmail.com' })
    email: string;


    @IsString()
    @IsIn(['male', 'female'], { message: 'Invalid gender' })
    gender: string;

    @Matches(/^\d+$/, { message: 'Phone number must contain only numbers' })
    phone: string;
}



