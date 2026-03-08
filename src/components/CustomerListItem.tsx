import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Customer } from '../types/customer';

type CustomerListItemProps = {
  customer: Customer;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export function CustomerListItem({
  customer,
  onPress,
  style,
}: CustomerListItemProps) {
  return (
    <Pressable style={[styles.card, style]} onPress={onPress}>
      <Text style={styles.name}>{customer.name}</Text>
      <Text style={styles.email}>{customer.email}</Text>
      <View
        style={[
          styles.badge,
          customer.status === 'active'
            ? styles.activeBadge
            : styles.inactiveBadge,
        ]}
      >
        <Text style={styles.badgeText}>{customer.status.toUpperCase()}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  email: {
    marginTop: 4,
    fontSize: 14,
    color: '#475569',
  },
  badge: {
    marginTop: 10,
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  activeBadge: {
    backgroundColor: '#DCFCE7',
  },
  inactiveBadge: {
    backgroundColor: '#FEE2E2',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: '#0F172A',
  },
});
