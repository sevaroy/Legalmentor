import Exa from 'exa-js'

import { SearchResults } from '@/lib/types'

import { BaseSearchProvider } from './base'

interface ExaResult {
  title: string | null
  url: string
  highlight?: string
  text?: string
}

export class ExaSearchProvider extends BaseSearchProvider {
  async search(
    query: string,
    maxResults: number = 10,
    _searchDepth: 'basic' | 'advanced' = 'basic',
    includeDomains: string[] = [],
    excludeDomains: string[] = []
  ): Promise<SearchResults> {
    const apiKey = process.env.EXA_API_KEY
    this.validateApiKey(apiKey, 'EXA')

    const exa = new Exa(apiKey)
    const exaResults = await exa.searchAndContents(query, {
      highlights: true,
      numResults: maxResults,
      includeDomains,
      excludeDomains
    })

    return {
      results: exaResults.results.map((result: ExaResult) => ({
        title: result.title || 'Untitled',
        url: result.url,
        content: result.highlight || result.text || ''
      })),
      query,
      images: [],
      number_of_results: exaResults.results.length
    }
  }
}
