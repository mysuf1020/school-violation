'use client'

import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import domtoimage from 'dom-to-image'
import { Portal } from '@radix-ui/react-portal'
import { Button } from './ui'
import Icon from './icons'

type QrisProps = {
  storeName: string
  nmid: string
  terminalId: string
  nns: string
}

const DomToImageWrapper = ({
  children,
  onFinish,
  storeName,
}: PropsWithChildren<{ onFinish: () => void; storeName: string }>) => {
  const originalImageRef = useRef<HTMLDivElement>(null)
  const downloadInitiated = useRef(false)

  const download = useCallback(async () => {
    if (originalImageRef.current !== null) {
      const dataUrl = await domtoimage.toJpeg(originalImageRef.current)
      if (dataUrl) {
        const link = document.createElement('a')
        link.download = `QRIS-STATIC-${storeName}.jpeg`
        link.href = dataUrl
        link.target = '_blank'
        link.click()
      }
    }
  }, [storeName])

  useEffect(() => {
    if (!downloadInitiated.current) {
      downloadInitiated.current = true

      if (originalImageRef.current) {
        download().then(() => {
          onFinish()
        })
      }
    }
  }, [download, onFinish])

  return <div ref={originalImageRef}>{children}</div>
}

const QRIS = ({
  children,
  storeName,
  nmid,
  terminalId,
}: PropsWithChildren<QrisProps>) => {
  const originalWidth = 1077
  const originalHeight = 1509
  const NNS = process.env.NEXT_PUBLIC_BLUEPAY_NNS || '93600919'
  const [downloading, setDownloading] = useState(false)

  const originalQrisTemplated = (
    <div className="w-full h-full relative bg-[url(/assets/qris-template.png)] bg-contain bg-center bg-no-repeat">
      <div className="w-[65%] absolute z-1 top-[30%] left-[17%] h-auto">
        {children}
      </div>
    </div>
  )

  const downloadQRIS = () => {
    if (!downloading) {
      setDownloading(true)
    }
  }

  const onDownloaded = useCallback(() => {
    setDownloading(false)
  }, [])

  return (
    <>
      <Portal>
        {downloading && (
          <div className="fixed top-[-9999px] left-[-9999px] z-[999] flex justify-center items-center">
            <DomToImageWrapper
              onFinish={() => onDownloaded()}
              storeName={storeName}
            >
              <div
                style={{ width: originalWidth, height: originalHeight }}
                className="relative"
              >
                <div className="absolute z-10 top-[20%] left-0 text-4xl font-bold right-0 text-center">
                  {storeName}
                </div>
                <div className="absolute z-10 top-[24%] left-0 text-4xl right-0 text-center">
                  NMID : {nmid}
                </div>
                <div className="absolute z-10 top-[27%] left-0 text-4xl right-0 text-center">
                  {terminalId}
                </div>
                {originalQrisTemplated}
                <div className="absolute z-10 bottom-[4%] left-[10%] text-3xl">
                  Dicetak oleh: {NNS}
                </div>
              </div>
            </DomToImageWrapper>
          </div>
        )}
      </Portal>

      <div
        className="p-3 border rounded-lg relative"
        style={{
          width: originalWidth / 3,
          height: originalHeight / 3,
        }}
      >
        <div className="absolute z-10 top-[20%] left-0 text-[16px] font-bold right-0 text-center">
          {storeName}
        </div>
        <div className="absolute z-10 top-[25%] left-0 text-[12px] right-0 text-center">
          NMID : {nmid}
        </div>
        <div className="absolute z-10 top-[28%] left-0 text-[12px] right-0 text-center">
          {terminalId}
        </div>
        {originalQrisTemplated}
        <div className="absolute z-10 bottom-[7%] left-[10%] text-[12px]">
          Dicetak oleh: {NNS}
        </div>
      </div>
      <Button
        variant={'outline'}
        onClick={downloadQRIS}
        isLoading={downloading}
      >
        <Icon name={'DownloadOutlined'} />
        Download
      </Button>
    </>
  )
}

export default QRIS
