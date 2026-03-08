import { fetchCustomers } from '../src/services/customerService';

describe('customerService.fetchCustomers', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  async function resolveFetch<T>(promise: Promise<T>): Promise<T> {
    jest.advanceTimersByTime(1000);
    return promise;
  }

  test('returns first page with default page size', async () => {
    const result = await resolveFetch(fetchCustomers());

    expect(result.customers).toHaveLength(10);
    expect(result.customers[0].id).toBe('c-001');
    expect(result.nextOffset).toBe(10);
    expect(result.hasMore).toBe(true);
  });

  test('filters by search query', async () => {
    const result = await resolveFetch(fetchCustomers({ search: 'liam' }));

    expect(result.customers).toHaveLength(1);
    expect(result.customers[0].name).toContain('Liam');
    expect(result.nextOffset).toBe(1);
    expect(result.hasMore).toBe(false);
  });

  test('supports pagination for search results', async () => {
    const page1 = await resolveFetch(
      fetchCustomers({ search: 'example.com', limit: 7 }),
    );

    const page2 = await resolveFetch(
      fetchCustomers({
        search: 'example.com',
        limit: 7,
        offset: page1.nextOffset,
      }),
    );

    expect(page1.customers).toHaveLength(7);
    expect(page2.customers).toHaveLength(7);
    expect(page1.customers[0].id).toBe('c-001');
    expect(page2.customers[0].id).toBe('c-008');
    expect(page2.nextOffset).toBe(14);
    expect(page2.hasMore).toBe(true);
  });
});
