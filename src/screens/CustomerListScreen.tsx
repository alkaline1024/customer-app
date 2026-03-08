import React, { useEffect, useState } from 'react';
import {
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
import { CustomerListSkeleton } from '../components/CustomerListSkeleton';
import { useCustomers } from '../context/CustomersContext';
import { Customer } from '../types/customer';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../themes';

type Props = NativeStackScreenProps<RootStackParamList, 'CustomerList'>;

const MIN_REFRESH_MS = 800;

const SEARCH_DEBOUNCE_MS = 300;

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
    isLoadingMore,
    hasMoreCustomers,
    isSearching,
    searchError,
    error,
    loadCustomers,
    refreshCustomers,
    loadMoreCustomers,
    searchCustomers,
  } = useCustomers();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (customers.length === 0) {
      loadCustomers();
    }
  }, [customers.length, loadCustomers]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchCustomers(query);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [query, searchCustomers]);

  const isSearchMode = query.trim().length > 0;
  const displayedCustomers = customers;

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

  const onEndReached = async () => {
    await loadMoreCustomers();
  };

  const showInitialError = Boolean(error) && customers.length === 0;

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

      {isLoading || isSearching ? (
        <View style={styles.skeletonContainer}>
          <CustomerListSkeleton count={5} />
        </View>
      ) : showInitialError ? (
        <View style={styles.centeredState}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={displayedCustomers}
          keyExtractor={item => item.id}
          renderItem={renderCustomer}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={ListSeparator}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.35}
          ListFooterComponent={
            isSearching ? (
              <View style={styles.footerLoading}>
                <CustomerListSkeleton count={1} compact />
              </View>
            ) : isLoadingMore ? (
              <View style={styles.footerLoading}>
                <CustomerListSkeleton count={1} compact />
              </View>
            ) : !hasMoreCustomers && displayedCustomers.length > 0 ? (
              <View style={[styles.footerLoading, styles.centeredState]}>
                <Text style={styles.footerText}>
                  {isSearchMode ? 'No more results' : 'No more customers'}
                </Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.centeredState}>
              <Text style={styles.stateText}>No customers found.</Text>
            </View>
          }
        />
      )}
      {!showInitialError && error ? (
        <Text style={styles.inlineErrorText}>{error}</Text>
      ) : null}
      {searchError ? (
        <Text style={styles.inlineErrorText}>{searchError}</Text>
      ) : null}
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
  skeletonContainer: {
    paddingBottom: theme.spacing.xl,
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
  inlineErrorText: {
    marginTop: theme.spacing.sm,
    ...theme.typography.bodySmall,
    color: theme.colors.danger,
    textAlign: 'center',
  },
  footerLoading: {
    paddingVertical: theme.spacing.md,
  },
  footerText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
  },
});
