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

interface ExtendedRecipe extends Recipe {
  averageStars: number
  votes: { stars: number }[]
}
export interface recipeTeaserProps {
  recipe: ExtendedRecipe
}

export function RecipeTeaser({ recipe }: recipeTeaserProps) {
  const [fullStars, setFullStars] = useState<number>(Math.floor(recipe.averageStars))
  const [halfStar, setHalfStar] = useState<boolean>(recipe.averageStars % 1 >= 0.5)
  const [currentRecipe, setCurrentRecipe] = useState<ExtendedRecipe | null>(recipe)
  const [session, setSession] = useState<Session | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [clickedIndex, setClickedIndex] = useState<number | null>(null)
  // const fullStars = Math.floor(currentRecipe.averageStars)
  // const halfStar = currentRecipe.averageStars % 1 >= 0.5

  getSession().then((sess) => {
    setSession(sess)
  })

  const handleRatingClick = async (index: number) => {
    const rating = index + 1
    if (session) {
      await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ recipeId: recipe.id, stars: rating })
      })
      setClickedIndex(index)
      setTimeout(() => {
        setClickedIndex(null)
      }, 1000)
      const updatedRecipe = await fetch(`/api/recipes/${recipe.id}?includeVotes=true`)
      const data = await updatedRecipe.json()
      const totalStars = data.recipe.votes.reduce((acc, vote) => acc + vote.stars, 0)
      const averageStars = data.recipe.votes.length ? totalStars / data.recipe.votes.length : 0
      setCurrentRecipe({
        ...data.recipe,
        averageStars
      })
      setFullStars(Math.floor(averageStars))
      setHalfStar(averageStars % 1 >= 0.5)
    } else {
      // todo display login modal
    }
  }

  return (
    <div className={styles.recipeTeaser}>
      <Link href={`/recipe/${currentRecipe.slug}`}>
        <figure>
          <Image
            src={currentRecipe.imageUrl}
            alt={currentRecipe.title}
            width={140}
            height={140}
            loading="lazy"
          />
        </figure>
        <h3>{currentRecipe.title}</h3>
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
            <Icon
              color={clickedIndex === i ? '#d8f94e' : 'black'}
              path={hoveredIndex !== null && i <= hoveredIndex ? mdiStar : (i < fullStars ? mdiStar : (i === fullStars && halfStar ? mdiStarHalfFull : mdiStarOutline))}
              size={1}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
