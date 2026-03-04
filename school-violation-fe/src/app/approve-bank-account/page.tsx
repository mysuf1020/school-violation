'use client'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Suspense, useEffect, useState } from 'react'
import { Button, Container, Spinner, Text } from '@/components/ui'
import { ApiError } from '@/lib/http-request/error-handler'

const approveBankAccount = async (token: string) => {
  const host = process.env.NEXT_PUBLIC_BASE_API_URL
  const response = await fetch(
    `${host}/api/v1/manual-registration/approve-bank-account`,
    {
      method: 'POST',
      body: JSON.stringify({
        access_token: token,
      }),
    },
  )
  if (response.ok) {
    const data = await response.json()
    return data
  } else {
    const data = await response.json()
    throw new ApiError(response, {
      error: data.error,
    })
  }
}

const approveBankAccountChanges = async (token: string) => {
  const host = process.env.NEXT_PUBLIC_BASE_API_URL
  const response = await fetch(
    `${host}/api/v1/manual-registration/approve-bank-account-change`,
    {
      method: 'POST',
      body: JSON.stringify({
        token,
      }),
    },
  )
  if (response.ok) {
    const data = await response.json()
    return data
  } else {
    const data = await response.json()
    throw new ApiError(response, {
      error: data.error,
    })
  }
}

const ApproveBankAccountPage = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get('t') || ''
  const ref = searchParams.get('ref') || ''
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string>()

  useEffect(() => {
    approveBankAccount(token)
      .then(() => {
        setSuccess(true)
        setError(undefined)
      })
      .catch((error) => {
        if (error instanceof ApiError) {
          const errorMessage = error.payload.error as string
          console.error(errorMessage)
          setError(errorMessage)
          setSuccess(false)
        }
      })
  }, [token])

  useEffect(() => {
    if (ref && ref === 'edit') {
      approveBankAccountChanges(token)
        .then(() => {
          setSuccess(true)
          setError(undefined)
        })
        .catch((error) => {
          if (error instanceof ApiError) {
            const errorMessage = error.payload.error as string
            console.error(errorMessage)
            setError(errorMessage)
            setSuccess(false)
          }
        })
    }
  }, [ref, token])

  if (error) {
    return (
      <Container className="flex pt-20 justify-center h-screen">
        <div className="flex flex-col gap-4">
          <Image
            src={'/assets/bluepay-logo.svg'}
            width={99}
            height={24}
            alt="Bluepay Office"
            className="mb-4"
          />
          <Text level="l">
            Terjadi kesalahan saat menyetujui penambahan akun bank Anda.
          </Text>
          <Text level="l">Refresh halaman ini untuk mencoba kembali</Text>
          <Text className="text-red-500">Error: {error}</Text>
          <div>
            <Button
              variant={'outline'}
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          </div>
        </div>
      </Container>
    )
  }

  if (success) {
    return (
      <Container className="flex pt-20 justify-center h-screen">
        <div className="flex flex-col gap-4">
          <Image
            src={'/assets/bluepay-logo.svg'}
            width={99}
            height={24}
            alt="Bluepay Office"
            className="mb-4"
          />
          <Text level="l">
            Terima kasih, Anda telah berhasil menyetujui penambahan akun bank.
          </Text>
        </div>
      </Container>
    )
  }

  return (
    <Container className="flex flex-col pt-20 justify-center h-screen">
      <Image
        src={'/assets/bluepay-logo.svg'}
        width={99}
        height={24}
        alt="Bluepay Office"
        className="mb-4"
      />
      <div>
        <Spinner size="xl" className="text-brand-500" />
      </div>
    </Container>
  )
}

const ApproveBankAccountPageWrapper = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <ApproveBankAccountPage />
    </Suspense>
  )
}

export default ApproveBankAccountPageWrapper
