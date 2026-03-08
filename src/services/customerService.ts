import { mockCustomers } from '../data/mockCustomers';
import { Customer, UpdateCustomerBody } from '../types/customer';

const NETWORK_DELAY_MS = 250;
const DEFAULT_PAGE_SIZE = 10;

function fakePromise(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

type FetchCustomerQuery = {
  offset?: number;
  limit?: number;
  search?: string;
};

export type FetchCustomersResult = {
  customers: Customer[];
  hasMore: boolean;
  nextOffset: number;
};

export async function fetchCustomers(
  query: FetchCustomerQuery = {},
): Promise<FetchCustomersResult> {
  await fakePromise(NETWORK_DELAY_MS);

  const offset = query.offset ?? 0;
  const limit = query.limit ?? DEFAULT_PAGE_SIZE;
  const search = query.search?.trim().toLowerCase();

  let sourceCustomers = mockCustomers;

  if (search) {
    // MOCK: search is executed in-memory to simulate backend query filtering.
    sourceCustomers = sourceCustomers.filter(customer => {
      return (
        customer.name.toLowerCase().includes(search) ||
        customer.email.toLowerCase().includes(search)
      );
    });
  }

  // MOCK: pagination is executed in-memory to simulate backend paging.
  const customers = sourceCustomers.slice(offset, offset + limit);

  const nextOffset = offset + customers.length;

  return {
    customers,
    hasMore: nextOffset < sourceCustomers.length,
    nextOffset,
  };
}

export async function updateCustomer(
  body: UpdateCustomerBody,
): Promise<Customer> {
  await fakePromise(NETWORK_DELAY_MS);

  const existingCustomer = mockCustomers.find(
    customer => customer.id === body.customerId,
  );

  if (!existingCustomer) {
    throw new Error('Customer not found');
  }

  return saveCustomerInMemory({
    ...existingCustomer,
    name: body.name,
    email: body.email,
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

  return saveCustomerInMemory({
    ...existingCustomer,
    status,
  });
}

// MOCK: Saving the updated customer in-memory.

function saveCustomerInMemory(updatedCustomer: Customer): Customer {
  const customerIndex = mockCustomers.findIndex(
    customer => customer.id === updatedCustomer.id,
  );

  if (customerIndex < 0) {
    throw new Error('Customer not found');
  }

  mockCustomers[customerIndex] = updatedCustomer;
  return mockCustomers[customerIndex];
}
