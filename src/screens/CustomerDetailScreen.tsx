import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCustomers } from '../context/CustomersContext';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../themes';

type Props = NativeStackScreenProps<RootStackParamList, 'CustomerDetail'>;

export function CustomerDetailScreen({ navigation, route }: Props) {
  const { customerId } = route.params;
  const { customers } = useCustomers();

  const customer = useMemo(() => {
    return customers.find(item => item.id === customerId);
  }, [customers, customerId]);

  if (!customer) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Customer not found.</Text>
      </View>
    );
  }

  const nextActionLabel =
    customer.status === 'active' ? 'Deactivate' : 'Activate';

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{customer.name}</Text>
      <Text style={styles.meta}>{customer.email}</Text>
      <Text style={styles.meta}>{customer.phone}</Text>
      <Text style={styles.meta}>Company: {customer.company}</Text>
      <Text style={styles.meta}>Status: {customer.status.toUpperCase()}</Text>

      <Pressable
        style={[styles.button, styles.primaryButton]}
        onPress={() => {
          // TODO: toggle customer
        }}
      >
        <Text style={styles.buttonText}>{nextActionLabel}</Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.secondaryButton]}
        onPress={() =>
          navigation.navigate('EditCustomer', {
            customerId: customer.id,
          })
        }
      >
        <Text style={styles.buttonText}>Edit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  name: {
    ...theme.typography.screenTitle,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  meta: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  button: {
    marginTop: theme.spacing.lg,
    borderRadius: theme.radius.sm,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  secondaryButton: {
    backgroundColor: theme.colors.secondary,
  },
  buttonText: {
    ...theme.typography.button,
    color: theme.colors.textInverse,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  statusErrorText: {
    marginTop: theme.spacing.sm,
    color: theme.colors.danger,
    ...theme.typography.bodySmall,
  },
  errorText: {
    color: theme.colors.danger,
    ...theme.typography.label,
  },
});
