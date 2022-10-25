import { IsEnum, IsNumber, IsInt, IsString } from 'class-validator';

export enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TESTING = 'testing',
}

export class EnvironmentVariables {
  // Environment
  @IsEnum(Environment)
  NODE_ENV: Environment;
  @IsInt()
  VERSION: number;
  @IsNumber()
  PORT: number;

  // JWT OPTIONS
  @IsString()
  JWT_SECRET: string;
  @IsString()
  JWT_EXPIRATION_TIME: string;

  // MYSQL DATABASE
  @IsString()
  DATABASE_NAME: string;
  @IsString()
  DATABASE_USERNAME: string;
  @IsString()
  DATABASE_PASSWORD: string;
  @IsInt()
  DATABASE_PORT: number;
}
