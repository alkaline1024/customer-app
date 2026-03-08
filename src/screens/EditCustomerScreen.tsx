import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../themes';

type Props = NativeStackScreenProps<RootStackParamList, 'EditCustomer'>;

export function EditCustomerScreen({ route }: Props) {
  const { customerId } = route.params;

  // TODO: implement edit form

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Customer</Text>
      <Text style={styles.text}>Customer ID: {customerId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  title: {
    ...theme.typography.sectionTitle,
    color: theme.colors.textPrimary,
    marginBottom: 10,
  },
  text: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
});
