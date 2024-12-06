import React, { useState, useEffect } from 'react'
import { Recipe } from '@prisma/client'
import Image from 'next/image'

import { Button } from 'components/atoms/button'
import {
  mdiPlus,
  mdiMinus
} from '@mdi/js'
import Icon from '@mdi/react'

import styles from './recipe--full.module.scss'

export interface recipeFullProps {
  recipe: Recipe & { averageStars: number, ingredientNames: Ingredient[] }
}

interface Ingredient {
  name: string
  amount: string
  unit: string
}

export function RecipeFull({ recipe }: recipeFullProps) {
  const [servings, setServings] = useState<number>(recipe.servings)
  const [ingredients, setIngredients] = useState<Ingredient[]>(recipe.ingredientNames)
  useEffect(() => {
    const newIngredients = recipe.ingredientNames.map((ingredient) => {
      const newAmount = Math.ceil((Number(ingredient.amount) / recipe.servings) * servings).toString()
      return {
        ...ingredient,
        amount: newAmount
      }
    })
    setIngredients(newIngredients)
  }, [servings, recipe.servings, recipe.ingredientNames])
  const updateServings = (type: string) => {
    console.log('update ingredients')
    const newServings = type === 'plus' ? servings + 1 : servings - 1
    setServings(newServings)
  }
  return (
    <div className={styles.recipeFull}>
      <div>
        <h1>{recipe.title}</h1>
        <figure>
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            width={400}
            height={400}
            loading="lazy"
          />
        </figure>
      </div>
      <div>
        <h2>{recipe.description}</h2>
        <p>Ingredients</p>
        <div className={styles.servingsWrapper}>
          <Button
            target="_self"
            href={null}
            modifier={['ingredient', 'left']}
            fill
            onButtonClick={() => updateServings('plus')}
          >
            <Icon path={mdiPlus} size={1} />
          </Button>
          <span className={styles.servings}>{servings}</span>
          <Button
            target="_self"
            href={null}
            modifier={['ingredient', 'right']}
            fill
            onButtonClick={() => updateServings('minus')}
          >
            <Icon path={mdiMinus} size={1} />
          </Button>
        </div>
        <ul>
          {ingredients.map((ingredient) => (
            <li key={ingredient.name}>
              <span>
                {ingredient.name}
                {' '}
                {ingredient.unit === 'DEFAULT' && 'x'}
                {ingredient.amount}
                {ingredient.unit === 'GRAMS' ? 'g' : (ingredient.unit === 'MILLILITERS' ? 'ml' : '')}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
