export interface User {
  firstname: string;
  lastname: string;
  address?: {
    street?: string;
    postcode?: string;
    city?: string;
  };
};