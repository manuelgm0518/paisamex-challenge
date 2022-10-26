import { IsEnum, IsNumber, IsInt, IsString, IsUrl } from 'class-validator';

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

  // EXCHANGE RATES API
  @IsUrl()
  EXCHANGE_RATES_API_URL: string;
  @IsString()
  EXCHANGE_RATES_API_KEY: string;
}
