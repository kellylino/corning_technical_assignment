import { Inclusion, ValidationErrors } from '../types';

export const validateInclusion = (data: Partial<Inclusion>): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Name validation
  if (!data.name || data.name.trim() === '') {
    errors.name = 'Name cannot be empty';
  }

  // Radius validation
  if (data.radius === undefined || data.radius === null ) {
    errors.radius = 'Radius is required';
  } else if (typeof data.radius !== 'number' || isNaN(data.radius)) {
    errors.radius = 'Radius must be a number';
  } else if (data.radius <= 0) {
    errors.radius = 'Radius must be greater than 0';
  }

  // Type validation
  const validTypes = ['bubble', 'crack', 'scratch'];
  if (!data.type) {
    errors.type = 'Type is required';
  } else if (!validTypes.includes(data.type)) {
    errors.type = 'Type must be bubble, crack, or scratch';
  }

  return errors;
};
