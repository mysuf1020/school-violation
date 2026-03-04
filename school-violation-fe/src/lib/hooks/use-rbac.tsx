'use client'

import { useContext } from 'react'
import { RBACContext, RBACState } from '../providers/rbac-providers'

const useRBAC = (): RBACState => {
  const context = useContext(RBACContext)

  if (!context) {
    throw new Error(
      'RBAC Context is not found. Please Wrap or provide your component with <RBACProvider />',
    )
  }

  return context
}

export default useRBAC
