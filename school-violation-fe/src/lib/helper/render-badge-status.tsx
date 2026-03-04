import { ReactNode } from 'react'
import { Badge, BadgeVariant } from '@/components/ui'
import { StoreStatus, PTENStatus } from '@/lib/models/store'
import { EntityStatus } from '../models/entity'
import { BrandStatus } from '../models/brand'

type BadgeStatus = StoreStatus | PTENStatus | EntityStatus | BrandStatus

type StatusBadge = {
  variant: BadgeVariant['variant']
  label: string
}

const statusToVariant: Record<BadgeStatus, StatusBadge> = {
  [StoreStatus.ACTIVE]: {
    variant: 'success',
    label: 'ACTIVE',
  },
  [StoreStatus.INACTIVE]: {
    variant: 'destructive',
    label: 'INACTIVE',
  },

  [PTENStatus.INVALID]: {
    variant: 'destructive',
    label: 'DECLINED',
  },
  [PTENStatus.COMPLETED]: {
    variant: 'success',
    label: 'REGISTERED',
  },
  [PTENStatus.PENDING_RESULT]: {
    variant: 'secondary',
    label: 'WAITING RESULT',
  },
  [PTENStatus.READY_REGISTER]: {
    variant: 'default',
    label: 'READY REGISTER',
  },
  [PTENStatus.ONHOLD]: {
    variant: 'destructive',
    label: 'DECLINED',
  },
}

const renderBadgeStatus = (status?: BadgeStatus): ReactNode => {
  if (!status) return <span>-</span>
  const mapStatus = statusToVariant[status]
  return (
    <Badge variant={mapStatus?.variant} className="font-semibold">
      {mapStatus?.label}
    </Badge>
  )
}

export { renderBadgeStatus }
