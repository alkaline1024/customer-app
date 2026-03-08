import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { theme } from '../themes';

type CustomerListSkeletonProps = {
  count?: number;
  compact?: boolean;
};

export function CustomerListSkeleton({
  count = 4,
  compact = false,
}: CustomerListSkeletonProps) {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [opacity]);

  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={`customer-skeleton-${index}`}
          style={[styles.card, compact && styles.compactCard]}
        >
          <Animated.View style={[styles.name, { opacity }]} />
          <Animated.View style={[styles.email, { opacity }]} />
          <Animated.View style={[styles.badge, { opacity }]} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: theme.border.hairline,
    borderColor: theme.customer.cardBorderColor,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  compactCard: {
    marginBottom: 0,
  },
  name: {
    height: 16,
    width: '62%',
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.backgroundMuted,
  },
  email: {
    marginTop: theme.spacing.sm,
    height: 14,
    width: '80%',
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.backgroundMuted,
  },
  badge: {
    marginTop: 10,
    height: 22,
    width: 84,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.backgroundMuted,
  },
});
