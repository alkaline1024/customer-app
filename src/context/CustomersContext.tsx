import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import {
  fetchCustomers,
  FetchCustomersResult,
  setCustomerStatus,
  updateCustomer,
} from '../services/customerService';
import { Customer, UpdateCustomerBody } from '../types/customer';

const PAGE_SIZE = 10;

type CustomersState = {
  customers: Customer[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMoreCustomers: boolean;
  nextOffset: number;
  isRefreshing: boolean;
  error: string | null;
  searchQuery: string;
  isSearching: boolean;
  searchError: string | null;
  statusUpdatingCustomerId: string | null;
  statusUpdateError: string | null;
};

type CustomersContextValue = CustomersState & {
  loadCustomers: () => Promise<void>;
  loadMoreCustomers: () => Promise<void>;
  refreshCustomers: () => Promise<void>;
  searchCustomers: (query: string) => Promise<void>;
  editCustomer: (body: UpdateCustomerBody) => Promise<void>;
  toggleCustomerStatus: (customerId: string) => Promise<void>;
};

type CustomersAction =
  | { type: 'LOAD_START'; refresh: boolean }
  | {
      type: 'LOAD_SUCCESS';
      customers: Customer[];
      hasMoreCustomers: boolean;
      nextOffset: number;
      append: boolean;
    }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'LOAD_MORE_START' }
  | { type: 'SEARCH_START'; query: string }
  | {
      type: 'SEARCH_SUCCESS';
      customers: Customer[];
      hasMoreCustomers: boolean;
      nextOffset: number;
    }
  | { type: 'SEARCH_ERROR'; error: string }
  | { type: 'SEARCH_CLEAR' }
  | { type: 'CUSTOMER_UPDATED'; customer: Customer }
  | { type: 'STATUS_TOGGLE_START'; customerId: string }
  | { type: 'STATUS_TOGGLE_SUCCESS'; customer: Customer }
  | { type: 'STATUS_TOGGLE_ERROR'; error: string };

const initialState: CustomersState = {
  customers: [],
  isLoading: false,
  isLoadingMore: false,
  isRefreshing: false,
  hasMoreCustomers: true,
  nextOffset: 0,
  error: null,
  searchQuery: '',
  isSearching: false,
  searchError: null,
  statusUpdatingCustomerId: null,
  statusUpdateError: null,
};

function customersReducer(
  state: CustomersState,
  action: CustomersAction,
): CustomersState {
  switch (action.type) {
    case 'LOAD_START':
      return {
        ...state,
        isLoading: !action.refresh,
        isLoadingMore: false,
        isRefreshing: action.refresh,
        error: null,
      };
    case 'LOAD_SUCCESS':
      return {
        ...state,
        customers: action.append
          ? [...state.customers, ...action.customers]
          : action.customers,
        isLoading: false,
        isLoadingMore: false,
        isRefreshing: false,
        hasMoreCustomers: action.hasMoreCustomers,
        nextOffset: action.nextOffset,
        error: null,
      };
    case 'LOAD_ERROR':
      return {
        ...state,
        isLoading: false,
        isLoadingMore: false,
        isRefreshing: false,
        error: action.error,
      };
    case 'LOAD_MORE_START':
      return {
        ...state,
        isLoadingMore: true,
        error: null,
      };
    case 'SEARCH_START':
      return {
        ...state,
        searchQuery: action.query,
        isSearching: true,
        searchError: null,
      };
    case 'SEARCH_SUCCESS':
      return {
        ...state,
        customers: action.customers,
        hasMoreCustomers: action.hasMoreCustomers,
        nextOffset: action.nextOffset,
        isSearching: false,
        searchError: null,
      };
    case 'SEARCH_ERROR':
      return {
        ...state,
        isSearching: false,
        searchError: action.error,
      };
    case 'SEARCH_CLEAR':
      return {
        ...state,
        searchQuery: '',
        isSearching: false,
        searchError: null,
      };
    case 'CUSTOMER_UPDATED':
      return {
        ...state,
        customers: state.customers.map(
          customer =>
            customer.id === action.customer.id ? action.customer : customer, // Update the customer in the list
        ),
        error: null,
      };
    case 'STATUS_TOGGLE_START':
      return {
        ...state,
        statusUpdatingCustomerId: action.customerId,
        statusUpdateError: null,
      };
    case 'STATUS_TOGGLE_SUCCESS':
      return {
        ...state,
        customers: state.customers.map(
          customer =>
            customer.id === action.customer.id ? action.customer : customer, // Update the customer in the list
        ),
        statusUpdatingCustomerId: null,
        statusUpdateError: null,
      };
    case 'STATUS_TOGGLE_ERROR':
      return {
        ...state,
        statusUpdatingCustomerId: null,
        statusUpdateError: action.error,
      };
    default:
      return state;
  }
}

const CustomersContext = createContext<CustomersContextValue | undefined>(
  undefined,
);

export function CustomersProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(customersReducer, initialState);

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
    [],
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
    [loadFirstPage],
  );

  const editCustomer = useCallback(async (body: UpdateCustomerBody) => {
    const updatedCustomer = await updateCustomer(body);
    dispatch({ type: 'CUSTOMER_UPDATED', customer: updatedCustomer });
  }, []);

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
    [state.customers],
  );

  const provider = useMemo(
    () => ({
      ...state,
      loadCustomers,
      refreshCustomers,
      loadMoreCustomers,
      searchCustomers,
      editCustomer,
      toggleCustomerStatus,
    }),
    [
      state,
      loadCustomers,
      refreshCustomers,
      loadMoreCustomers,
      searchCustomers,
      editCustomer,
      toggleCustomerStatus,
    ],
  );

  return (
    <CustomersContext.Provider value={provider}>
      {children}
    </CustomersContext.Provider>
  );
}

function dispatchLoadSuccess(
  dispatch: React.Dispatch<CustomersAction>,
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

export function useCustomers(): CustomersContextValue {
  const context = useContext(CustomersContext);

  if (!context) {
    throw new Error('useCustomers must be used inside CustomersProvider');
  }

  return context;
}
