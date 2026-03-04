'use client'

import { FC, useMemo, useState } from 'react'

import { pdfjs, Document, Page } from 'react-pdf'
import type { DocumentCallback } from 'react-pdf/dist/shared/types.js'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc =
  process.env.NEXT_PUBLIC_PDF_WORKER_URL ||
  'https://unpkg.com/pdfjs-dist@5.3.31/build/pdf.worker.min.mjs'

type PDFFile = File | string | null

type PDFViewerProps = {
  pdfFile: PDFFile
  className?: string
  width?: number
}

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
  wasmUrl: '/wasm/',
}

const InternalPDFViewer: FC<PDFViewerProps> = ({
  pdfFile,
  width,
  className,
}) => {
  const [pages, setPages] = useState<number>()

  const onDocumentLoad = ({ numPages }: DocumentCallback) => {
    setPages(numPages)
  }

  const onLoadError = (error: Error) => {
    console.log('Error loading document', error)
  }

  const onSourceError = (error: Error) => {
    console.log('Source error:', error)
  }

  const _file = useMemo<PDFFile>(() => pdfFile, [pdfFile])

  const fileKey = ((): string => {
    if (_file instanceof File) {
      return _file.name
    } else if (typeof _file === 'string') {
      return _file
    }

    return '_tempFileKey'
  })()
  return (
    <div className={className}>
      <Document
        key={fileKey}
        file={_file}
        onLoadSuccess={onDocumentLoad}
        options={options}
        onLoadError={onLoadError}
        onSourceError={onSourceError}
      >
        {Array.from(new Array(pages)).map((item, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={width}
          />
        ))}
      </Document>
    </div>
  )
}

export default InternalPDFViewer
