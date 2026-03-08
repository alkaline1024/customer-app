import { baseTokens } from './tokens';
import { customerTokens } from './customerTokens';

export const theme = {
  colors: {
    ...baseTokens.colors,
    primary: customerTokens.brand.primary,
    secondary: customerTokens.brand.secondary,
  },
  spacing: baseTokens.spacing,
  radius: baseTokens.radius,
  border: baseTokens.border,
  typography: baseTokens.typography,
  customer: customerTokens.customer,
};
