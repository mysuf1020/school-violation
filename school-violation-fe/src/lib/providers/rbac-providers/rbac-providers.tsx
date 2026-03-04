'use client'

import {
  FC,
  PropsWithChildren,
  createContext,
  useMemo,
  useCallback,
} from 'react'
import { useSession } from 'next-auth/react'
import type { ResourceAction } from '@/lib/models/authentication'
import { AppRole, AppResource, RBACState } from './types'

const RBACContext = createContext<RBACState | null>(null)

const RBACProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data } = useSession()
  const user = data?.user as { roles?: { role_id: string; role_name: string; permissions: { resource: string; actions: string[] }[] }[] } | undefined
  const roles = useMemo<AppRole[]>(
    () =>
      user?.roles?.map<AppRole>(({ role_id, role_name, permissions }) => {
        const appPermissions = permissions.map<AppResource>(
          ({ resource, actions }) => {
            const appActions = actions.map((action) => action as ResourceAction)
            return new AppResource(resource, appActions)
          },
        )

        return new AppRole(role_id, role_name, appPermissions)
      }) ?? [],
    [user?.roles],
  )

  const resources = useMemo<AppResource[]>(() => {
    const permissions =
      user?.roles?.map<AppResource[]>(({ permissions }) =>
        permissions.map<AppResource>(
          ({ actions, resource }) =>
            new AppResource(
              resource,
              actions?.map((action) => action as ResourceAction) ?? [],
            ),
        ),
      ) ?? []

    return permissions.reduce<AppResource[]>(
      (prev, cur) => [...prev, ...cur],
      [],
    )
  }, [user?.roles])

  const role = useCallback<(name: string) => AppRole | undefined>(
    (name: string) => {
      return roles.find((role) => role.roleName === name)
    },
    [roles],
  )

  const resource = useCallback<
    (resourceName: string) => AppResource | undefined
  >(
    (resourceName: string) => {
      const foundResources = resources.filter(
        (resource) => resource.name === resourceName,
      )

      if (foundResources.length === 0) return undefined
      const mergedResource = foundResources.reduce<AppResource>(
        (prev, cur) =>
          new AppResource(prev.name, [...prev.actions, ...cur.actions]),
        new AppResource(resourceName, []),
      )

      return mergedResource
    },
    [resources],
  )

  const haveResource = useCallback<(resourceName: string) => boolean>(
    (resourceName: string) => {
      return resource(resourceName) !== undefined
    },
    [resource],
  )

  const haveRole = useCallback<(roleName: string) => boolean>(
    (roleName: string) => {
      return role(roleName) !== undefined
    },
    [role],
  )

  const canRead = useCallback<(resourceNames: string[]) => boolean>(
    (resourceNames: string[]) => {
      return (
        resourceNames.length > 0 &&
        resourceNames.every((resourceName) => {
          const foundResource = resources.find(
            (resource) => resource.name == resourceName,
          )

          if (!foundResource) {
            return false
          }

          return foundResource.actions.includes('read')
        })
      )
    },
    [resources],
  )

  const canCreate = useCallback<(resourceNames: string[]) => boolean>(
    (resourceNames: string[]) => {
      return (
        resourceNames.length > 0 &&
        resourceNames.every((resourceName) => {
          const foundResource = resources.find(
            (resource) => resource.name == resourceName,
          )

          if (!foundResource) {
            return false
          }

          return foundResource.actions.includes('create')
        })
      )
    },
    [resources],
  )

  const canUpdate = useCallback<(resourceNames: string[]) => boolean>(
    (resourceNames: string[]) => {
      return (
        resourceNames.length > 0 &&
        resourceNames.every((resourceName) => {
          const foundResource = resources.find(
            (resource) => resource.name == resourceName,
          )

          if (!foundResource) {
            return false
          }

          return foundResource.actions.includes('update')
        })
      )
    },
    [resources],
  )

  const canDelete = useCallback<(resourceNames: string[]) => boolean>(
    (resourceNames: string[]) => {
      return (
        resourceNames.length > 0 &&
        resourceNames.every((resourceName) => {
          const foundResource = resources.find(
            (resource) => resource.name == resourceName,
          )

          if (!foundResource) {
            return false
          }

          return foundResource.actions.includes('delete')
        })
      )
    },
    [resources],
  )

  const canReview = useCallback<(resourceNames: string[]) => boolean>(
    (resourceNames: string[]) => {
      return (
        resourceNames.length > 0 &&
        resourceNames.every((resourceName) => {
          const foundResource = resources.find(
            (resource) => resource.name == resourceName,
          )

          if (!foundResource) {
            return false
          }

          return foundResource.actions.includes('review')
        })
      )
    },
    [resources],
  )

  return (
    <RBACContext
      value={{
        roles,
        resources,
        role,
        resource,
        haveResource,
        haveRole,
        canRead,
        canCreate,
        canUpdate,
        canDelete,
        canReview,
      }}
    >
      {children}
    </RBACContext>
  )
}

export { RBACProvider, RBACContext }
