import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCustomers } from '../context/CustomersContext';
import { RootStackParamList } from '../navigation/types';

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
      <Text style={styles.meta}>Status: {customer.status}</Text>

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
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  meta: {
    fontSize: 15,
    color: '#334155',
    marginBottom: 6,
  },
  button: {
    marginTop: 16,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#1D4ED8',
  },
  secondaryButton: {
    backgroundColor: '#0F766E',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 16,
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    color: '#475569',
    fontSize: 13,
  },
});
