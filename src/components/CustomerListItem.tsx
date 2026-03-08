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
import { theme } from '../themes';

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
    alignSelf: 'flex-start',
    borderRadius: theme.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: theme.spacing.xs,
  },
  activeBadge: {
    backgroundColor: theme.customer.status.activeBackground,
  },
  inactiveBadge: {
    backgroundColor: theme.customer.status.inactiveBackground,
  },
  badgeText: {
    ...theme.typography.badge,
    color: theme.customer.status.text,
  },
});
