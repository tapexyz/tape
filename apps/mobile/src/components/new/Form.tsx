import { PublicationMainFocus } from '@lenstube/lens'
import type { MutableRefObject } from 'react'
import React from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { Animated, Text, View } from 'react-native'

import type { FormData } from '~/screens/NewPublication'
import useMobilePublicationStore from '~/store/publication'

import AccordionWithSwitch from '../ui/AccordionWithSwitch'
import Input from '../ui/Input'
import Separator from '../ui/Separator'
import AccessControl from './AccessControl'
import Attachments from './Attachments'
import ChooseFocus from './ChooseFocus'
import CollectTemplates from './CollectTemplates'

const Form = ({
  form,
  shakeRef
}: {
  form: UseFormReturn<FormData>
  shakeRef: MutableRefObject<Animated.Value>
}) => {
  const {
    control,
    formState: { errors }
  } = form
  const draftedPublication = useMobilePublicationStore(
    (state) => state.draftedPublication
  )
  const setDraftedPublication = useMobilePublicationStore(
    (state) => state.setDraftedPublication
  )

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
              errored={Boolean(errors.title)}
            />
          </Animated.View>
        )}
        name="title"
      />

      <Separator />
      <Controller
        control={control}
        rules={{
          required: false
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Feel like sharing more?"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            numberOfLines={4}
            multiline={true}
            style={{
              textAlignVertical: 'top'
            }}
          />
        )}
        name="description"
      />
      {errors.description && <Text>This is required.</Text>}
      <Separator />

      <AccordionWithSwitch
        active={draftedPublication.attachmentEnabled}
        setActive={(value) =>
          setDraftedPublication({
            ...draftedPublication,
            attachmentEnabled: value,
            mainFocus: PublicationMainFocus.Video
          })
        }
        text="Attachments"
        content={
          <>
            <ChooseFocus />
            <Attachments />
          </>
        }
      />

      <AccordionWithSwitch
        active={draftedPublication.collectEnabled}
        setActive={(value) =>
          setDraftedPublication({
            ...draftedPublication,
            collectEnabled: value
          })
        }
        text="Collectible"
        content={<CollectTemplates />}
      />

      <AccordionWithSwitch
        active={draftedPublication.referenceEnabled}
        setActive={(value) =>
          setDraftedPublication({
            ...draftedPublication,
            referenceEnabled: value
          })
        }
        text="Exclusive Access"
        content={<AccessControl />}
      />
    </View>
  )
}

export default Form
