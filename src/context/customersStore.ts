import { Customer } from '../types/customer';

export type CustomersState = {
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

export type CustomersAction =
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

export const initialCustomersState: CustomersState = {
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

export function customersReducer(
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
        customers: state.customers.map(customer =>
          customer.id === action.customer.id ? action.customer : customer,
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
        customers: state.customers.map(customer =>
          customer.id === action.customer.id ? action.customer : customer,
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
