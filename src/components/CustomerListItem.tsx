import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { Customer } from '../types/customer';
import { theme } from '../themes';
import { CustomerStatusBadge } from './CustomerStatusBadge';

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
      <CustomerStatusBadge status={customer.status} style={styles.badge} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: theme.border.hairline,
    borderColor: theme.customer.cardBorderColor,
  },
  name: {
    ...theme.typography.label,
    color: theme.colors.textPrimary,
  },
  email: {
    marginTop: theme.spacing.xs,
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
  },
  badge: {
    marginTop: 10,
  },
});
