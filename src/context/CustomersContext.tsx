import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import { fetchCustomers } from '../services/customerService';
import { Customer } from '../types/customer';

type CustomersState = {
  customers: Customer[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
};

type CustomersContextValue = CustomersState & {
  loadCustomers: () => Promise<void>;
  refreshCustomers: () => Promise<void>;
};

type CustomersAction =
  | { type: 'LOAD_START'; refresh: boolean }
  | { type: 'LOAD_SUCCESS'; customers: Customer[] }
  | { type: 'LOAD_ERROR'; error: string };

const initialState: CustomersState = {
  customers: [],
  isLoading: false,
  isRefreshing: false,
  error: null,
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

  const value = useMemo(
    () => ({
      ...state,
      loadCustomers,
      refreshCustomers,
    }),
    [state, loadCustomers, refreshCustomers],
  );

  return (
    <CustomersContext.Provider value={value}>
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
