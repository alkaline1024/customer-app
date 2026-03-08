import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CustomerDetailScreen } from '../screens/CustomerDetailScreen';
import { CustomerListScreen } from '../screens/CustomerListScreen';
import { EditCustomerScreen } from '../screens/EditCustomerScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="CustomerList"
          component={CustomerListScreen}
          options={{ title: 'Customer List' }}
        />
        <Stack.Screen
          name="CustomerDetail"
          component={CustomerDetailScreen}
          options={{ title: 'Customer Detail' }}
        />
        <Stack.Screen
          name="EditCustomer"
          component={EditCustomerScreen}
          options={{ title: 'Edit Customer' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
