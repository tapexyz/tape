import { zodResolver } from '@hookform/resolvers/zod'
import React, { useCallback, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Animated, Text, TouchableOpacity, View } from 'react-native'
import type { z } from 'zod'
import { object, string } from 'zod'

import useMobilePublicationStore from '~/store/publication'

import Input from '../ui/Input'
import Separator from '../ui/Separator'

const formSchema = object({
  title: string()
    .min(5, { message: 'Name should be atleast 5 characters' })
    .max(30, { message: 'Name should not exceed 30 characters' })
    .regex(/^[a-z0-9]+$/, {
      message: 'Name should only contain alphanumeric characters'
    }),
  description: string()
    .min(5, { message: 'Name should be atleast 5 characters' })
    .max(30, { message: 'Name should not exceed 30 characters' })
    .regex(/^[a-z0-9]+$/, {
      message: 'Name should only contain alphanumeric characters'
    })
})
type FormData = z.infer<typeof formSchema>

const Form = () => {
  const shakeRef = useRef(new Animated.Value(0))

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: ''
    }
  })
  const setDraftedPublication = useMobilePublicationStore(
    (state) => state.setDraftedPublication
  )

  const shake = useCallback(() => {
    // makes the sequence loop
    Animated.loop(
      // runs the animation array in sequence
      Animated.sequence([
        // shift element to the left by 2 units
        Animated.timing(shakeRef.current, {
          toValue: -2,
          duration: 50,
          useNativeDriver: true
        }),
        // shift element to the right by 2 units
        Animated.timing(shakeRef.current, {
          toValue: 2,
          duration: 50,
          useNativeDriver: true
        }),
        // bring the element back to its original position
        Animated.timing(shakeRef.current, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true
        })
      ]),
      // loops the above animation config 2 times
      { iterations: 2 }
    ).start()
  }, [])

  const onSubmit = (data: FormData) => {
    shake()
  }

  return (
    <View>
      <Controller
        control={control}
        rules={{
          required: true
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Animated.View
            style={{ transform: [{ translateY: shakeRef.current }] }}
          >
            <Input
              placeholder="What's happening?"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          </Animated.View>
        )}
        name="title"
      />

      <Separator />
      <Controller
        control={control}
        rules={{
          required: true
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Feel like sharing more? - spill or skip!"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            numberOfLines={4}
            multiline={true}
            style={{
              height: 100,
              textAlignVertical: 'top'
            }}
          />
        )}
        name="description"
      />
      {errors.description && <Text>This is required.</Text>}
      <Separator />

      <TouchableOpacity onPress={() => onSubmit(getValues())}>
        <Text style={{ color: 'white' }}>Submit</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Form
