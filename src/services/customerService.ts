import { mockCustomers } from '../data/mockCustomers';
import { Customer } from '../types/customer';

const NETWORK_DELAY_MS = 250;

function fakePromise(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchCustomers(): Promise<Customer[]> {
  await fakePromise(NETWORK_DELAY_MS);
  return mockCustomers;
}
