import { describe, it, expect } from 'vitest'
import router from '../router'

describe('Router Configuration', () => {
  it('registers the /shadowwatch route with correct metadata', () => {
    const route = router.getRoutes().find((r) => r.path === '/shadowwatch')
    expect(route).toBeDefined()
    expect(route?.name).toBe('shadowwatch')
    expect(route?.meta?.title).toContain('ShadowWatch')
  })
})
