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
import { theme } from '../themes';

type Props = NativeStackScreenProps<RootStackParamList, 'CustomerList'>;

const MIN_REFRESH_MS = 800;

function ListSeparator() {
  return <View style={styles.separator} />;
}

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

    // Ensure the refresh indicator is visible for at least MIN_REFRESH_MS milliseconds
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
          <ActivityIndicator size="small" color={theme.colors.primary} />
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
          ItemSeparatorComponent={ListSeparator}
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
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 14,
  },
  title: {
    ...theme.typography.screenTitle,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  searchInput: {
    backgroundColor: theme.colors.surface,
    borderWidth: theme.border.hairline,
    borderColor: theme.colors.borderDefault,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    ...theme.typography.label,
    marginBottom: 14,
  },
  listContent: {
    paddingBottom: theme.spacing.xl,
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
    marginTop: theme.spacing.sm,
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
  },
  errorText: {
    color: theme.colors.danger,
    textAlign: 'center',
  },
});
