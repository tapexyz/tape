import type { KeenSliderPlugin } from 'keen-slider'

const WheelControls: KeenSliderPlugin = (slider) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  const debounceDuration: number = 100

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

  const handleFocus = () => {
    slider.container.focus()
  }

  slider.on('created', () => {
    slider.container.setAttribute('tabindex', '0')
    slider.container.addEventListener('wheel', handleWheelEvent, {
      passive: false
    })
    slider.container.addEventListener('mouseover', handleFocus)
  })

  slider.on('destroyed', () => {
    if (slider.container) {
      slider.container.removeEventListener('wheel', handleWheelEvent)
      slider.container.removeEventListener('mouseover', handleFocus)
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

  const handleFocus = () => {
    slider.container.focus()
  }

  slider.on('created', () => {
    slider.container.setAttribute('tabindex', '0')
    slider.container.addEventListener('focus', eventFocus)
    slider.container.addEventListener('blur', eventBlur)
    slider.container.addEventListener('keydown', eventKeydown)
    slider.container.addEventListener('mouseover', handleFocus)
  })

  slider.on('destroyed', () => {
    if (slider.container) {
      slider.container.removeEventListener('focus', eventFocus)
      slider.container.removeEventListener('blur', eventBlur)
      slider.container.removeEventListener('keydown', eventKeydown)
      slider.container.removeEventListener('mouseover', handleFocus)
    }
  })
}

export { KeyboardControls, WheelControls }
