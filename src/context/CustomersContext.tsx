import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import {
  customersReducer,
  CustomersState,
  initialCustomersState,
} from './customersStore';
import { CustomersActions, useCustomersActions } from './useCustomersActions';

type CustomersContextValue = CustomersState & CustomersActions;

const CustomersContext = createContext<CustomersContextValue | undefined>(
  undefined,
);

export function CustomersProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(customersReducer, initialCustomersState);
  const actions = useCustomersActions(state, dispatch);

  const provider = useMemo(
    () => ({
      ...state,
      ...actions,
    }),
    [state, actions],
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
