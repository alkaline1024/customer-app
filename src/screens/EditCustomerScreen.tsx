import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCustomers } from '../context/CustomersContext';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../themes';

type Props = NativeStackScreenProps<RootStackParamList, 'EditCustomer'>;

const editCustomerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
});

type EditCustomerFormValues = z.infer<typeof editCustomerSchema>;

export function EditCustomerScreen({ navigation, route }: Props) {
  const { customerId } = route.params;
  const { customers, editCustomer } = useCustomers();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const customer = useMemo(() => {
    return customers.find(item => item.id === customerId);
  }, [customerId, customers]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditCustomerFormValues>({
    resolver: zodResolver(editCustomerSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  useEffect(() => {
    if (!customer) {
      return;
    }

    reset({
      name: customer.name,
      email: customer.email,
    });
  }, [customer, reset]);

  const onSubmit = async (values: EditCustomerFormValues) => {
    setSubmitError(null);

    try {
      await editCustomer({
        customerId,
        name: values.name,
        email: values.email,
      });
    } catch {
      setSubmitError('Unable to save customer. Please try again.');
      return;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('CustomerDetail', { customerId });
  };

  if (!customer) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Edit Customer</Text>
        <Text style={styles.errorText}>Customer not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Customer</Text>

      <Text style={styles.label}>Name</Text>
      <Controller
        control={control}
        name="name"
        render={({ field: { value, onBlur, onChange } }) => (
          <TextInput
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="Customer name"
            autoCapitalize="words"
            style={styles.input}
          />
        )}
      />
      {errors.name ? (
        <Text style={styles.errorText}>{errors.name.message}</Text>
      ) : null}

      <Text style={styles.label}>Email</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { value, onBlur, onChange } }) => (
          <TextInput
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="customer@email.com"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            style={styles.input}
          />
        )}
      />
      {errors.email ? (
        <Text style={styles.errorText}>{errors.email.message}</Text>
      ) : null}
      {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}

      <Pressable
        style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color={theme.colors.textInverse} />
        ) : (
          <Text style={styles.saveButtonText}>Save</Text>
        )}
      </Pressable>
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
    marginBottom: theme.spacing.md,
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: theme.border.hairline,
    borderColor: theme.colors.borderDefault,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    ...theme.typography.label,
    color: theme.colors.textPrimary,
  },
  saveButton: {
    marginTop: theme.spacing.lg,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.65,
  },
  saveButtonText: {
    ...theme.typography.button,
    color: theme.colors.textInverse,
  },
  errorText: {
    marginTop: theme.spacing.xs,
    ...theme.typography.bodySmall,
    color: theme.colors.danger,
  },
});
