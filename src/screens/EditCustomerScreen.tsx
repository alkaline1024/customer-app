import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

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
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    color: '#334155',
    marginBottom: 8,
  },
});
