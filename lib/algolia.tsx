import React from 'react'
import { liteClient as algoliasearch } from 'algoliasearch/lite'
import { useInstantSearch } from 'react-instantsearch'

export const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!
)

interface EmptyQueryBoundaryProps {
  children: any
  fallback?: React.ReactNode
}

export function EmptyQueryBoundary({ children, fallback }: EmptyQueryBoundaryProps) {
  const { indexUiState, results } = useInstantSearch()

  if (!indexUiState.query) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    )
  }

  // eslint-disable-next-line no-underscore-dangle
  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    )
  }

  return children
}
