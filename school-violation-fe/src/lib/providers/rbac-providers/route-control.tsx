import Image from 'next/image'
import { FC, ReactNode, PropsWithChildren, useMemo, useContext } from 'react'
import { useSession } from 'next-auth/react'
import { Spinner } from '@/components/ui'
import { RoutingRules } from './types'
import { RBACContext } from './rbac-providers'

type RouteControlProperties = PropsWithChildren<{
  // if provided will check if the current page is matching this path
  path?: string
  // routing table
  rules?: RoutingRules
  // the minimal action that must be provided
  // can be create, read, update, and delete
  // if not provided defaults to read
  // if provided more than 1, all actions must met
  actions: ('create' | 'read' | 'update' | 'delete')[]
  // the fallback component to render when user has no permission
  fallback?: ReactNode
}>

const RouteControl: FC<RouteControlProperties> = ({
  path,
  rules,
  actions = ['read'],
  fallback,
  children,
}) => {
  const session = useSession()
  const { canRead, canUpdate, canDelete, canCreate, resources, resource } =
    useContext(RBACContext)!
  const resourceNames = useMemo<string[]>(
    () => resources?.map((resource) => resource.name) ?? [],
    [resources],
  )

  const isAllowed = useMemo<boolean | undefined>(() => {
    let allowed = undefined
    if (actions.includes('read')) {
      allowed = canRead(resourceNames)
    }

    if (actions.includes('create')) {
      allowed = canCreate(resourceNames)
    }

    if (actions.includes('update')) {
      allowed = canUpdate(resourceNames)
    }

    if (actions.includes('delete')) {
      allowed = canDelete(resourceNames)
    }

    if (path && rules) {
      const matchingRules = Array.from(rules.entries()).find(([pattern]) => {
        if (typeof pattern == 'string') {
          return path === pattern
        } else if (pattern instanceof RegExp) {
          return pattern.test(path)
        }

        return false
      })

      if (matchingRules !== undefined) {
        const allowedResources = matchingRules[1]
        if (Array.isArray(allowedResources)) {
          allowed =
            allowedResources.find((allowedResource) =>
              resourceNames.includes(allowedResource),
            ) !== undefined
        } else {
          allowed = allowedResources(resource)
        }
      }
    }

    return allowed
  }, [
    canRead,
    canUpdate,
    canDelete,
    canCreate,
    actions,
    path,
    rules,
    resourceNames,
    resource,
  ])
  if (
    isAllowed === undefined ||
    session.status === 'loading' ||
    session.data === undefined
  ) {
    return (
      <div className="flex fixed top-0 bottom-0 left-0 right-0 z-[900] bg-white justify-center items-center h-screen w-full text-blue-500">
        <div className="flex flex-col gap-4 items-center">
          <Image
            src="/assets/bluepay-logo.svg"
            width={100}
            height={30}
            alt="Bluepay Office"
          />
          <Spinner size="xl" />
        </div>
      </div>
    )
  }
  return <>{isAllowed ? children : fallback}</>
}

export { RouteControl }
