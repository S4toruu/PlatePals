import React, { useEffect } from 'react'
import { liteClient as algoliasearch } from 'algoliasearch/lite'
import {
  InstantSearch,
  SearchBox,
  Hits,
  useInstantSearch
} from 'react-instantsearch'

import Image from 'next/image'
import Link from 'next/link'
import Icon from '@mdi/react'
import { mdiAccount } from '@mdi/js'

import { Hit } from 'components/molecules/hit'

import styles from './header.module.scss'

// Import your Algolia credentials (API Key, App ID)
const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!
)

interface EmptyQueryBoundaryProps {
  children: any
  fallback?: React.ReactNode
}

function EmptyQueryBoundary({ children, fallback }: EmptyQueryBoundaryProps) {
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

export function Header() {
  const classes = [styles.headerDefault]

  useEffect(() => {
    const handleScroll = (): void => {
      if (window.scrollY >= 48) {
        classes.push(styles.sticky)
      } else {
        classes.pop()
      }
    }

    window.addEventListener('scroll', handleScroll)

    return (): void => {
      window.removeEventListener('scroll', handleScroll)
    }
  })

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}
    >
      <header className={classes.join(' ')}>
        <div className={styles.headerTop}>
          <figure>
            <Image
              src="https://placehold.co/120x40.png"
              alt="Logo"
              width={120}
              height={40}
              loading="lazy"
            />
          </figure>
          <div className={styles.searchWrapper}>
            <SearchBox placeholder="Search" />
            <EmptyQueryBoundary fallback={null}>
              <Hits hitComponent={Hit} />
            </EmptyQueryBoundary>
          </div>
          <nav>
            <ul>
              <li><Link href="/account"><Icon path={mdiAccount} size={1} /></Link></li>
            </ul>
          </nav>
        </div>
        <div className={styles.headerBottom}>
          <nav>
            <ul>
              <li><Link href="/">All recipes</Link></li>
              <li><Link href="/?type=starters">Starters</Link></li>
              <li><Link href="/?type=cookies">Cookies</Link></li>
            </ul>
          </nav>
        </div>
      </header>
    </InstantSearch>
  )
}
