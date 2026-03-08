export type CustomerStatus = 'active' | 'inactive';

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: CustomerStatus;
  createdAt: string;
};

export type UpdateCustomerBody = {
  customerId: string;
  name: string;
  email: string;
};
