import { Recipe } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {
  mdiStar, mdiStarHalfFull, mdiStarOutline
} from '@mdi/js'
import Icon from '@mdi/react'
import styles from './recipe--teaser.module.scss'

export interface recipeTeaserProps {
  recipe: Recipe & { averageStars: number }
}

export function RecipeTeaser({ recipe }: recipeTeaserProps) {
  const fullStars = Math.floor(recipe.averageStars)
  const halfStar = recipe.averageStars % 1 >= 0.5
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)

  return (
    <div className={styles.recipeTeaser}>
      <Link href={`/recipe/${recipe.slug}`}>
        <figure>
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            width={140}
            height={140}
            loading="lazy"
          />
        </figure>
        <h3>{recipe.title}</h3>
        <ul className={styles.rank}>
          {[...Array(fullStars)].map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={`full-star-${i}`}><Icon path={mdiStar} size={1} /></li>
          ))}
          {halfStar && <li key="half-star"><Icon path={mdiStarHalfFull} size={1} /></li>}
          {[...Array(emptyStars)].map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={`empty-star-${i}`}><Icon path={mdiStarOutline} size={1} /></li>
          ))}
        </ul>
      </Link>
    </div>
  )
}
