import { mockCustomers } from '../data/mockCustomers';
import { Customer, UpdateCustomerBody } from '../types/customer';

const NETWORK_DELAY_MS = 250;

function fakePromise(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function saveCustomer(updatedCustomer: Customer): Customer {
  const customerIndex = mockCustomers.findIndex(
    customer => customer.id === updatedCustomer.id,
  );

  if (customerIndex < 0) {
    throw new Error('Customer not found');
  }

  mockCustomers[customerIndex] = updatedCustomer;
  return mockCustomers[customerIndex];
}

export async function fetchCustomers(): Promise<Customer[]> {
  await fakePromise(NETWORK_DELAY_MS);
  return mockCustomers;
}

export async function updateCustomer(
  input: UpdateCustomerBody,
): Promise<Customer> {
  await fakePromise(NETWORK_DELAY_MS);

  const existingCustomer = mockCustomers.find(
    customer => customer.id === input.customerId,
  );

  if (!existingCustomer) {
    throw new Error('Customer not found');
  }

  return saveCustomer({
    ...existingCustomer,
    name: input.name,
    email: input.email,
  });
}

export async function setCustomerStatus(
  customerId: string,
  status: Customer['status'],
): Promise<Customer> {
  await fakePromise(NETWORK_DELAY_MS);

  const existingCustomer = mockCustomers.find(
    customer => customer.id === customerId,
  );

  if (!existingCustomer) {
    throw new Error('Customer not found');
  }

  return saveCustomer({
    ...existingCustomer,
    status,
  });
}
