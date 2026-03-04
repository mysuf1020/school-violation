'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

/* eslint-disable @next/next/no-img-element */
const QrImage = ({ value, size = 500 }: { value: string; size?: number }) => {
  const [qrUrl, setQrUrl] = useState<string>('')

  useEffect(() => {
    if (!value) return

    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(value, { width: size })
        setQrUrl(url)
      } catch (err) {
        console.error('Failed to generate QR code:', err)
      }
    }

    generateQR()
  }, [size, value])

  return qrUrl ? (
    <img src={qrUrl} width={'100%'} height={'100%'} alt="QR code" />
  ) : (
    <p>Loading QR...</p>
  )
}

export default QrImage
