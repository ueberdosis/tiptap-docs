import { ENVIRONMENT } from './constants'
/**
 * Checks if the site is in production
 * @returns boolean
 */
export const isProductionSite = () => {
  return ENVIRONMENT === 'production'
}
