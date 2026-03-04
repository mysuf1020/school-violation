'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useEffect, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import Icon from '@/components/icons'
import {
  Button,
  Field,
  Flex,
  Form,
  Input,
  InputPassword,
  Text,
  Title,
} from '@/components/ui'
import { LoginFormSchema, loginSchema } from '@/lib/form-schema/login'

export default function LoginForm() {
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  })
  const { control, handleSubmit, setError } = form

  const route = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const reason = searchParams.get('reason')
  const callbackUrl = searchParams.get('callbackUrl')
  const redirectUrl = callbackUrl
    ? decodeURI(callbackUrl)
    : '/merchant-onboarding'
  const [isPending, startTransition] = useTransition()

  const onSubmit: SubmitHandler<LoginFormSchema> = (data, e) => {
    e?.preventDefault()
    startTransition(async () => {
      const response = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      })
      if (response.error) {
        switch (response.error) {
          case 'CredentialsSignin':
            toast.error('Invalid Username / Password')
            setError('email', { message: '' })
            setError('password', { message: '' })
            break
          case 'Configuration':
            toast.error('Internal server error')
            break
          default:
            toast.error('Unknown error occured')
            break
        }
        return
      }
      toast.success('Sign in successful')
      route.replace(redirectUrl)
    })
  }

  useEffect(() => {
    if (error === 'CredentialsSignin') {
      toast.error('Invalid email or password')
    } else if (error === 'SessionRequired') {
      toast.error('You must be logged in to access this page')
    } else if (error === 'AccessDenied') {
      toast.error('Access denied')
    }
  }, [error])

  useEffect(() => {
    if (reason === 'session-expired') {
      toast.error('Session timeout, please re-login to your account')
    }
  }, [reason])

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex direction="col" gap="4" className="w-[280px] sm:w-[320px]">
          <Flex className="text-left mb-6 items-start gap-2" direction="col">
            <Icon
              name="LockOutlined"
              size={36}
              className="mt-2 text-main-500"
            />
            <div>
              <Title level="d4" className="mb-2">
                Login
              </Title>
              <Text className="text-neutral-700">
                Sign in to BluePay Back Office
              </Text>
            </div>
          </Flex>
          <Field
            control={control}
            name="email"
            label="Email"
            render={({ field }) => (
              <Input
                {...field}
                type="email"
                placeholder="Email"
                className="w-full"
              />
            )}
          />

          <Field
            control={control}
            name="password"
            label="Password"
            render={({ field }) => (
              <InputPassword
                {...field}
                placeholder="Password"
                className="w-full"
              />
            )}
          />
          <Flex gap="1" className="mt-8">
            <Text className="text-right text-sm">Need help?</Text>
            <Link
              target="_blank"
              href={
                process.env.NEXT_PUBLIC_CONTACT_SUPPORT_URL ||
                'https://wa.me/6285117617610'
              }
              className="text-right text-sm font-semibold text-blue-500 hover:underline cursor-pointer"
            >
              Contact Support
            </Link>
          </Flex>
          <Button type="submit" className="w-full" isLoading={isPending}>
            Login
          </Button>
        </Flex>
      </form>
    </Form>
  )
}
