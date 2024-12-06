import React from 'react'
import Link from 'next/link'
import { Highlight } from 'react-instantsearch'
import styles from './hit.module.scss'

interface HitProps {
  hit: {
    objectID: string
    queryID: number
    __position: number
    title: string
    type: string
    slug: string
  };
}

// Define the Hit component to display each search result
export function Hit({ hit }: HitProps) {
  return (
    <div className={styles.hitItem}>
      <Link href={`recipe/${hit.slug}`}>
        <span>
          {' '}
          <Highlight attribute="title" hit={hit} />
        </span>
        <span>{hit.type}</span>
      </Link>
    </div>
  )
}
