import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="booking" />
      <Stack.Screen name="home" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="roomDetail" />
    </Stack>
  )
}

export default _layout;

const styles = StyleSheet.create({})