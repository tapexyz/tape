import QRCodeUtil from 'qrcode'
import type { FC } from 'react'
import React, { memo, useMemo } from 'react'

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

const QRCode: FC<Props> = ({ ecl = 'M', size = 200, value }) => {
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
          <rect
            key={`${i}_${x}_${y}`}
            fill={i % 2 !== 0 ? '#fff' : '#12131A'}
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

    matrix.forEach((row: number[], i: number) => {
      row.forEach((column: number, j: number) => {
        if (
          matrix[i][j] &&
          !(
            (i < 7 && j < 7) ||
            (i > matrix.length - 8 && j < 7) ||
            (i < 7 && j > matrix.length - 8)
          )
        ) {
          dots.push(
            <circle
              key={`${i}_${j}_${column}`}
              cx={i * cellSize + cellSize / 2}
              cy={j * cellSize + cellSize / 2}
              fill={'#000'}
              r={cellSize / 3}
            />
          )
        }
      })
    })

    return dots
  }, [ecl, size, value])

  return (
    <div className="rounded-3xl bg-white p-3">
      <svg height={size} width={size}>
        {dots}
      </svg>
    </div>
  )
}

export default memo(QRCode)
