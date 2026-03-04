/* eslint-disable @typescript-eslint/no-explicit-any */
import { signOut } from 'next-auth/react'
import { ErrorResponse } from '.'

/**
 * A custom Error class for HTTP errors.
 * It now includes an optional 'payload' property to hold the JSON body of an error response.
 */
export class ApiError extends Error {
  response: Response
  status: number
  payload?: any

  constructor(response: Response, payload?: any) {
    // Use the message from the API payload if available, otherwise default to status text
    const message =
      payload?.message || `API Error: ${response.status} ${response.statusText}`
    super(message)
    this.name = 'ApiError'
    this.response = response
    this.status = response.status
    this.payload = payload
  }
}

// Define the shape of the serializable error object we will always return to the client.
export interface CustomError {
  message: string
  error?: ErrorResponse
  details?: string | string[]
  code?: number
}

/**
 * Processes an error from a Server Action and returns a client-safe, serializable error object.
 *
 * @param {unknown} error - The error object caught in the Server Action.
 * @param {string} [context='performing action'] - A string describing the context for server-side logging.
 * @returns {CustomError} A serializable error object safe to return to the client.
 */
export function handleError(
  error: unknown,
  context: string = 'performing action',
  authenticatedApi: boolean = true,
): CustomError {
  console.error(`Server Action Error while ${context}:`, error)
  if (error && typeof error === 'object' && Object.hasOwn(error, 'response')) {
    const errorResponse = error as ErrorResponse
    if (errorResponse.status === 401 && authenticatedApi) {
      const currentUrl = typeof window !== 'undefined' && window.location.href
      const redirectUrl = currentUrl
        ? `/login?reason=session-expired&callbackUrl=${encodeURIComponent(currentUrl)}`
        : `/login?reason=session-expired`
      signOut({
        redirect: true,
        redirectTo: redirectUrl,
      })
    }
    return {
      message: 'API Error',
      error: errorResponse,
    }
  }

  if (error instanceof Error) {
    return { message: error.message }
  }

  return { message: 'An unexpected error occurred. Please try again.' }
}
