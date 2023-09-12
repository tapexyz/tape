import { LENSTUBE_LOGO } from '@lenstube/constants'
import { imageCdn } from '@lenstube/generic'
import QRCodeUtil from 'qrcode'
import type { FC } from 'react'
import React, { memo, useMemo } from 'react'
import Svg, {
  Circle,
  ClipPath,
  Defs,
  G,
  Image as SvgImage,
  Rect
} from 'react-native-svg'

import { colors } from '~/helpers/theme'

const generateMatrix = (
  value: string,
  errorCorrectionLevel: QRCodeUtil.QRCodeErrorCorrectionLevel
) => {
  const arr = Array.prototype.slice.call(
    QRCodeUtil.create(value, { errorCorrectionLevel }).modules.data,
    0
  )
  const sqrt = Math.sqrt(arr.length)
  return arr.reduce(
    (rows, key, index) =>
      (index % sqrt === 0
        ? rows.push([key])
        : rows[rows.length - 1].push(key)) && rows,
    []
  )
}

type Props = {
  ecl?: QRCodeUtil.QRCodeErrorCorrectionLevel
  logo?: string
  logoBackgroundColor?: string
  logoMargin?: number
  logoSize?: number
  size?: number
  value: string
}

const QRCode: FC<Props> = ({
  logo = imageCdn(LENSTUBE_LOGO),
  ecl = 'M',
  logoBackgroundColor = 'transparent',
  logoMargin = -5,
  logoSize = 20,
  size = 150,
  value
}) => {
  const dots = useMemo(() => {
    const dots: JSX.Element[] = []
    const matrix = generateMatrix(value, ecl)
    const cellSize = size / matrix.length
    let qrList = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 }
    ]

    qrList.forEach(({ x, y }) => {
      const x1 = (matrix.length - 7) * cellSize * x
      const y1 = (matrix.length - 7) * cellSize * y
      for (let i = 0; i < 3; i++) {
        dots.push(
          <Rect
            key={`${i}_${x}_${y}`}
            fill={i % 2 !== 0 ? colors.white : colors.garden}
            height={cellSize * (7 - i * 2)}
            width={cellSize * (7 - i * 2)}
            rx={9}
            ry={9}
            x={x1 + cellSize * i}
            y={y1 + cellSize * i}
          />
        )
      }
    })

    const clearArenaSize = Math.floor((logoSize + 3) / cellSize)
    const matrixMiddleStart = matrix.length / 2 - clearArenaSize / 2
    const matrixMiddleEnd = matrix.length / 2 + clearArenaSize / 2 - 1

    matrix.forEach((row: number[], i: number) => {
      row.forEach((column: number, j: number) => {
        if (
          matrix[i][j] &&
          !(
            (i < 7 && j < 7) ||
            (i > matrix.length - 8 && j < 7) ||
            (i < 7 && j > matrix.length - 8)
          ) &&
          !(
            i > matrixMiddleStart &&
            i < matrixMiddleEnd &&
            j > matrixMiddleStart &&
            j < matrixMiddleEnd &&
            i < j + clearArenaSize / 2 &&
            j < i + clearArenaSize / 2 + 1
          )
        ) {
          dots.push(
            <Circle
              key={`${i}_${j}_${column}`}
              cx={i * cellSize + cellSize / 2}
              cy={j * cellSize + cellSize / 2}
              fill={colors.garden}
              r={cellSize / 3}
            />
          )
        }
      })
    })

    return dots
  }, [ecl, logoSize, size, value])

  const logoPosition = size / 2 - logoSize / 2 - logoMargin
  const logoWrapperSize = logoSize + logoMargin * 2

  return (
    <Svg height={size} width={size}>
      <Defs>
        <ClipPath id="clip-wrapper">
          <Rect height={logoWrapperSize} width={logoWrapperSize} />
        </ClipPath>
        <ClipPath id="clip-logo">
          <Rect height={logoSize} width={logoSize} />
        </ClipPath>
      </Defs>
      <Rect fill="white" height={size} width={size} />
      {dots}
      {logo && (
        <G x={logoPosition} y={logoPosition}>
          <Rect
            clipPath="url(#clip-wrapper)"
            fill={logoBackgroundColor}
            height={logoWrapperSize}
            width={logoWrapperSize}
          />
          <G x={logoMargin} y={logoMargin}>
            <SvgImage
              clipPath="url(#clip-logo)"
              height={logoSize}
              width={logoSize}
              href={{
                uri: imageCdn(logo, 'AVATAR')
              }}
              preserveAspectRatio="xMidYMid slice"
            />
          </G>
        </G>
      )}
    </Svg>
  )
}

export default memo(QRCode)
