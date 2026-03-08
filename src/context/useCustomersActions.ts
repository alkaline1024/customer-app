import { Dispatch, useCallback } from 'react';
import {
  fetchCustomers,
  FetchCustomersResult,
  setCustomerStatus,
  updateCustomer,
} from '../services/customerService';
import { UpdateCustomerBody } from '../types/customer';
import { CustomersAction, CustomersState } from './customersStore';

const PAGE_SIZE = 10;

export type CustomersActions = {
  loadCustomers: () => Promise<void>;
  loadMoreCustomers: () => Promise<void>;
  refreshCustomers: () => Promise<void>;
  searchCustomers: (query: string) => Promise<void>;
  editCustomer: (body: UpdateCustomerBody) => Promise<void>;
  toggleCustomerStatus: (customerId: string) => Promise<void>;
};

export function useCustomersActions(
  state: CustomersState,
  dispatch: Dispatch<CustomersAction>,
): CustomersActions {
  const loadFirstPage = useCallback(
    async (
      props: {
        refresh?: boolean;
        search?: string;
      } = {},
    ) => {
      const { refresh = false, search = undefined } = props;

      dispatch({ type: 'LOAD_START', refresh });
      try {
        const result = await fetchCustomers({
          offset: 0,
          limit: PAGE_SIZE,
          search: search || undefined,
        });
        dispatchLoadSuccess(dispatch, result, false);
      } catch {
        dispatch({
          type: 'LOAD_ERROR',
          error: 'Failed to load customers. Please try again.',
        });
      }
    },
    [dispatch],
  );

  const loadCustomers = useCallback(async () => {
    await loadFirstPage();
  }, [loadFirstPage]);

  const refreshCustomers = useCallback(async () => {
    await loadFirstPage({ refresh: true, search: state.searchQuery });
  }, [loadFirstPage, state.searchQuery]);

  const loadMoreCustomers = useCallback(async () => {
    if (
      state.isLoading ||
      state.isRefreshing ||
      state.isLoadingMore ||
      !state.hasMoreCustomers
    ) {
      return;
    }

    dispatch({ type: 'LOAD_MORE_START' });

    try {
      const result = await fetchCustomers({
        offset: state.nextOffset,
        limit: PAGE_SIZE,
        search: state.searchQuery || undefined,
      });
      dispatchLoadSuccess(dispatch, result, true);
    } catch {
      dispatch({
        type: 'LOAD_ERROR',
        error: 'Failed to load more customers. Please try again.',
      });
    }
  }, [
    dispatch,
    state.hasMoreCustomers,
    state.isLoading,
    state.isLoadingMore,
    state.isRefreshing,
    state.nextOffset,
    state.searchQuery,
  ]);

  const searchCustomers = useCallback(
    async (query: string) => {
      const normalizedQuery = query.trim();

      if (!normalizedQuery) {
        dispatch({ type: 'SEARCH_CLEAR' });
        await loadFirstPage();
        return;
      }

      dispatch({ type: 'SEARCH_START', query: normalizedQuery });

      try {
        const result = await fetchCustomers({
          offset: 0,
          limit: PAGE_SIZE,
          search: normalizedQuery,
        });
        dispatch({
          type: 'SEARCH_SUCCESS',
          customers: result.customers,
          hasMoreCustomers: result.hasMore,
          nextOffset: result.nextOffset,
        });
      } catch {
        dispatch({
          type: 'SEARCH_ERROR',
          error: 'Failed to search customers. Please try again.',
        });
      }
    },
    [dispatch, loadFirstPage],
  );

  const editCustomer = useCallback(
    async (body: UpdateCustomerBody) => {
      const updatedCustomer = await updateCustomer(body);
      dispatch({ type: 'CUSTOMER_UPDATED', customer: updatedCustomer });
    },
    [dispatch],
  );

  const toggleCustomerStatus = useCallback(
    async (customerId: string) => {
      dispatch({ type: 'STATUS_TOGGLE_START', customerId });

      const targetCustomer = state.customers.find(
        customer => customer.id === customerId,
      );

      if (!targetCustomer) {
        dispatch({
          type: 'STATUS_TOGGLE_ERROR',
          error: 'Customer not found.',
        });
        return;
      }

      const nextStatus =
        targetCustomer.status === 'active' ? 'inactive' : 'active';

      try {
        const updatedCustomer = await setCustomerStatus(customerId, nextStatus);
        dispatch({ type: 'STATUS_TOGGLE_SUCCESS', customer: updatedCustomer });
      } catch {
        dispatch({
          type: 'STATUS_TOGGLE_ERROR',
          error: 'Unable to update customer status. Please try again.',
        });
      }
    },
    [dispatch, state.customers],
  );

  return {
    loadCustomers,
    refreshCustomers,
    loadMoreCustomers,
    searchCustomers,
    editCustomer,
    toggleCustomerStatus,
  };
}

function dispatchLoadSuccess(
  dispatch: Dispatch<CustomersAction>,
  result: FetchCustomersResult,
  append: boolean,
) {
  dispatch({
    type: 'LOAD_SUCCESS',
    customers: result.customers,
    hasMoreCustomers: result.hasMore,
    nextOffset: result.nextOffset,
    append,
  });
}
