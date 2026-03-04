import Link from 'next/link'
import Icon from '@/components/icons'

export default function NotFound() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col gap-8">
        <div className="bg-neutral-50 rounded-2xl py-4 px-8 text-center text-brand-400 flex flex-col gap-6">
          <h1 className="text-9xl">404</h1>
          <h2>Page Not Found</h2>
        </div>
        <p className="text-neutral-600">
          Sorry for the interuption, The page you are looking for does not
          exist.
        </p>
        <Link
          href="/"
          className="flex gap-2 items-center font-semibold text-center mx-auto"
        >
          <Icon name="HomeOutlined" size={20} />
          Go back home
        </Link>
      </div>
    </div>
  )
}
