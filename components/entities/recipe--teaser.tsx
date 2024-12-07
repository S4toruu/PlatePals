import React, { useState } from 'react'
import { getSession } from 'next-auth/react'
import { Session } from 'next-auth'
import { Recipe } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import {
  mdiStar, mdiStarHalfFull, mdiStarOutline
} from '@mdi/js'
import Icon from '@mdi/react'
import styles from './recipe--teaser.module.scss'

export interface recipeTeaserProps {
  recipe: Recipe & { averageStars: number }
}

export function RecipeTeaser({ recipe }: recipeTeaserProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const fullStars = Math.floor(recipe.averageStars)
  const halfStar = recipe.averageStars % 1 >= 0.5

  getSession().then((sess) => {
    setSession(sess)
  })

  const handleRatingClick = (index: number) => {
    const rating = index + 1
    // todo Saves the rating to the database
    console.log(`Rating saved: ${rating}`)
    if (session) {
      // todo POST request to save rating
    } else {
      // todo display login modal
    }
  }

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
      </Link>
      <ul
        className={styles.rank}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {[...Array(5)].map((_, i) => (
          <li
            // eslint-disable-next-line react/no-array-index-key
            key={`star-${i}`}
            onMouseEnter={() => setHoveredIndex(i)}
            onClick={() => handleRatingClick(i)}
          >
            <Icon path={hoveredIndex !== null && i <= hoveredIndex ? mdiStar : (i < fullStars ? mdiStar : (i === fullStars && halfStar ? mdiStarHalfFull : mdiStarOutline))} size={1} />
          </li>
        ))}
      </ul>
    </div>
  )
}
