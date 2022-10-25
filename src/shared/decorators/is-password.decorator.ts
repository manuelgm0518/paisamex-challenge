import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsPassword(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isPassword',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        defaultMessage: (args: ValidationArguments) => `${propertyName} ${validatePassword(args.value)}`,
        validate(value: any) {
          return validatePassword(value) === null;
        },
      },
    });
  };
}

function validatePassword(value: any): string | null {
  if (!/[A-Z]/.test(value)) return 'must contain at least one upper case letter';
  if (!/[a-z]/.test(value)) return 'must contain at least one lower case letter';
  if (!/[0-9]/.test(value)) return 'must contain at least one number';
  if (!/[#?!@$%^&*-]/.test(value)) return 'must contain at least one special character';
  if (value.length < 8) return 'minimum length is 8';
  if (value.length > 32) return 'maximum length is 32';
  return null;
}

export const PASSWORD_DESCRIPTION =
  'Must contain at least one of: upper case letter, lower case letter, number and special character. Minimum length is 8 and maximum is 32';
