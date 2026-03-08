import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { CustomerStatus } from '../types/customer';
import { theme } from '../themes';

type CustomerStatusBadgeProps = {
  status: CustomerStatus;
  style?: StyleProp<ViewStyle>;
};

export function CustomerStatusBadge({
  status,
  style,
}: CustomerStatusBadgeProps) {
  return (
    <View
      style={[
        styles.badge,
        status === 'active' ? styles.activeBadge : styles.inactiveBadge,
        style,
      ]}
    >
      <Text style={styles.badgeText}>{status.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
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
