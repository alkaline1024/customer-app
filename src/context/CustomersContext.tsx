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
  setCustomerStatus,
  updateCustomer,
} from '../services/customerService';
import { Customer, UpdateCustomerBody } from '../types/customer';

type CustomersState = {
  customers: Customer[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  statusUpdatingCustomerId: string | null;
  statusUpdateError: string | null;
};

type CustomersContextValue = CustomersState & {
  loadCustomers: () => Promise<void>;
  refreshCustomers: () => Promise<void>;
  editCustomer: (body: UpdateCustomerBody) => Promise<void>;
  toggleCustomerStatus: (customerId: string) => Promise<void>;
};

type CustomersAction =
  | { type: 'LOAD_START'; refresh: boolean }
  | { type: 'LOAD_SUCCESS'; customers: Customer[] }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'CUSTOMER_UPDATED'; customer: Customer }
  | { type: 'STATUS_TOGGLE_START'; customerId: string }
  | { type: 'STATUS_TOGGLE_SUCCESS'; customer: Customer }
  | { type: 'STATUS_TOGGLE_ERROR'; error: string };

const initialState: CustomersState = {
  customers: [],
  isLoading: false,
  isRefreshing: false,
  error: null,
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
        isRefreshing: action.refresh,
        error: null,
      };
    case 'LOAD_SUCCESS':
      return {
        ...state,
        customers: action.customers,
        isLoading: false,
        isRefreshing: false,
        error: null,
      };
    case 'LOAD_ERROR':
      return {
        ...state,
        isLoading: false,
        isRefreshing: false,
        error: action.error,
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

  const runLoad = useCallback(async (refresh: boolean) => {
    dispatch({ type: 'LOAD_START', refresh });

    try {
      const customers = await fetchCustomers();
      dispatch({ type: 'LOAD_SUCCESS', customers });
    } catch {
      dispatch({
        type: 'LOAD_ERROR',
        error: 'Failed to load customers. Please try again.',
      });
    }
  }, []);

  const loadCustomers = useCallback(async () => {
    await runLoad(false);
  }, [runLoad]);

  const refreshCustomers = useCallback(async () => {
    await runLoad(true);
  }, [runLoad]);

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
      editCustomer,
      toggleCustomerStatus,
    }),
    [
      state,
      loadCustomers,
      refreshCustomers,
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

export function useCustomers(): CustomersContextValue {
  const context = useContext(CustomersContext);

  if (!context) {
    throw new Error('useCustomers must be used inside CustomersProvider');
  }

  return context;
}
