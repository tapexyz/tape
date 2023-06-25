import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Button, Text, View } from 'react-native'

const SignInScreen = (): JSX.Element => {
  const { navigate, goBack } = useNavigation()

  return (
    <View
      style={{
        flex: 1,
        top: 0,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Text style={{ fontSize: 30 }}>This is a modal!</Text>
      <Button onPress={() => goBack()} title="Dismiss" />
      <Button onPress={() => navigate('ExploreTopsModal')} title="Open Modal" />
    </View>
  )
}

export default SignInScreen
