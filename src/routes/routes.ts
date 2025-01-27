import { Router } from 'express'
import { verifyCaptcha } from '@src/middleware'
import { healthCheck, initialCall, reserve, checkout } from '@src/controllers'

/**
 * Handle all routes
 * @param router
 */
export const routes = (router: Router) => {
  // Health check
  router.get('/api/health', healthCheck)

  // Initial call to fetch all seats
  router.get('/api/initial-call/:id', initialCall)

  // Reserve seats
  router.post('/api/reserve', verifyCaptcha, reserve)

  // Checkout seats
  router.put('/api/checkout', verifyCaptcha, checkout)
}
