import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomerListItem } from '../components/CustomerListItem';
import { useCustomers } from '../context/CustomersContext';
import { Customer } from '../types/customer';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CustomerList'>;

const MIN_REFRESH_MS = 800;

function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function CustomerListScreen({ navigation }: Props) {
  const {
    customers,
    isLoading,
    isRefreshing,
    error,
    loadCustomers,
    refreshCustomers,
  } = useCustomers();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (customers.length === 0) {
      loadCustomers();
    }
  }, [customers.length, loadCustomers]);

  const filteredCustomers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return customers;
    }

    return customers.filter(customer => {
      return (
        customer.name.toLowerCase().includes(normalizedQuery) ||
        customer.email.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [customers, query]);

  const onRefresh = async () => {
    const startedAt = Date.now();
    await refreshCustomers();
    const elapsed = Date.now() - startedAt;

    if (elapsed < MIN_REFRESH_MS) {
      await wait(MIN_REFRESH_MS - elapsed);
    }
  };

  const renderCustomer: ListRenderItem<Customer> = ({ item }) => {
    return (
      <CustomerListItem
        customer={item}
        onPress={() =>
          navigation.navigate('CustomerDetail', {
            customerId: item.id,
          })
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customers</Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search by name or email"
        style={styles.searchInput}
        autoCorrect={false}
        autoCapitalize="none"
      />

      {isLoading ? (
        <View style={styles.centeredState}>
          <ActivityIndicator size="small" color="#1D4ED8" />
          <Text style={styles.stateText}>Loading customers...</Text>
        </View>
      ) : error ? (
        <View style={styles.centeredState}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredCustomers}
          keyExtractor={item => item.id}
          renderItem={renderCustomer}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.centeredState}>
              <Text style={styles.stateText}>No customers found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 14,
  },
  listContent: {
    paddingBottom: 24,
  },
  separator: {
    height: 10,
  },
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  stateText: {
    marginTop: 8,
    fontSize: 14,
    color: '#475569',
  },
  errorText: {
    color: '#B91C1C',
    textAlign: 'center',
  },
});
