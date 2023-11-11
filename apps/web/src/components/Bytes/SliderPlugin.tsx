import type { KeenSliderPlugin } from 'keen-slider'

const WheelControls: KeenSliderPlugin = (slider) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  const debounceDuration: number = 100 // Adjust this duration based on testing

  const handleWheelEvent = (e: WheelEvent) => {
    e.preventDefault()

    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      if (e.deltaY < 0) {
        slider.prev()
      } else {
        slider.next()
      }
    }, debounceDuration)
  }

  slider.on('created', () => {
    slider.container.addEventListener('wheel', handleWheelEvent, {
      passive: false
    })
  })

  slider.on('destroyed', () => {
    if (slider.container) {
      slider.container.removeEventListener('wheel', handleWheelEvent)
    }
  })
}

const KeyboardControls: KeenSliderPlugin = (slider) => {
  let focused: boolean = false

  const eventFocus = (): void => {
    focused = true
  }

  const eventBlur = (): void => {
    focused = false
  }

  const eventKeydown = (e: KeyboardEvent): void => {
    if (!focused) {
      return
    }
    switch (e.key) {
      case 'ArrowUp':
        slider.prev()
        break
      case 'ArrowDown':
        slider.next()
        break
    }
  }

  slider.on('created', () => {
    slider.container.setAttribute('tabindex', '0')
    slider.container.addEventListener('focus', eventFocus)
    slider.container.addEventListener('blur', eventBlur)
    slider.container.addEventListener('keydown', eventKeydown)
  })
}

export { KeyboardControls, WheelControls }
