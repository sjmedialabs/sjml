/**
 * Utility to revalidate Next.js cache after content updates
 * This should be called after successful content updates in admin panel
 */

export async function revalidatePageCache(path: string, token?: string): Promise<boolean> {
  try {
    const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null)
    
    if (!authToken) {
      console.warn('No auth token available for revalidation')
      return false
    }

    const response = await fetch('/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ path })
    })

    if (response.ok) {
      const data = await response.json()
      console.log('Cache revalidated:', data.message)
      return true
    } else {
      console.error('Failed to revalidate cache:', await response.text())
      return false
    }
  } catch (error) {
    console.error('Revalidation error:', error)
    return false
  }
}

export async function revalidateMultiplePaths(paths: string[], token?: string): Promise<boolean> {
  try {
    const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null)
    
    if (!authToken) {
      console.warn('No auth token available for revalidation')
      return false
    }

    const response = await fetch('/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ paths })
    })

    if (response.ok) {
      const data = await response.json()
      console.log('Cache revalidated:', data.message)
      return true
    } else {
      console.error('Failed to revalidate cache:', await response.text())
      return false
    }
  } catch (error) {
    console.error('Revalidation error:', error)
    return false
  }
}

// Path mapping for different content types
export const PAGE_PATHS = {
  home: ['/'],
  about: ['/about'],
  services: ['/services'],
  'case-studies': ['/case-studies'],
  insights: ['/insights'],
  contact: ['/contact'],
  careers: ['/careers'],
  work: ['/work'],
  clients: ['/clients'],
  testimonials: ['/testimonials']
} as const

/**
 * Revalidate cache for a specific page type
 */
export async function revalidateContentPage(pageKey: keyof typeof PAGE_PATHS, token?: string): Promise<boolean> {
  const paths = PAGE_PATHS[pageKey]
  if (!paths || paths.length === 0) {
    console.warn(`Unknown page key: ${pageKey}`)
    return false
  }
  
  if (paths.length === 1) {
    return revalidatePageCache(paths[0], token)
  } else {
    return revalidateMultiplePaths(paths, token)
  }
}
