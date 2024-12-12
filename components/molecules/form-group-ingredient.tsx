import React, { useState } from 'react'
import { Unit } from '@prisma/client'
import { algoliasearch } from 'algoliasearch'
import { Select, Option } from 'components/atoms/select'
import styles from './form-group-ingredient.module.scss'

const client = algoliasearch(
  '976VLGQNAO',
  'bfc0ece95a5e29c9050ac6432a089df0'
)

export interface FormIngredient {
  name: string
  unit: string
  amount: string
}

interface FormGroupIngredientProps {
  ingredient: FormIngredient
  // eslint-disable-next-line no-unused-vars
  handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  // eslint-disable-next-line no-unused-vars
  handleAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  // eslint-disable-next-line no-unused-vars
  handleUnitChange: (option: Option) => void
}

export function FormGroupIngredient({
  ingredient,
  handleNameChange,
  handleUnitChange,
  handleAmountChange
}: FormGroupIngredientProps) {
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [searchResults, setSearchResults] = useState<any[]>([])

  const unitOptions = Object.keys(Unit).map((key) => ({
    id: key,
    name: Unit[key as keyof typeof Unit]
  }))

  const searchIngredients = async (query: string) => {
    if (query.length === 0) {
      setSearchResults([])
      return
    }
    const { hits } = await client.searchSingleIndex({
      indexName: 'plate_pals',
      searchParams: {
        query,
        hitsPerPage: 5,
        filters: 'category:ingredient'
      }
    })
    setSearchResults(hits)
  }

  const handleNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleNameChange(event)
    searchIngredients(event.target.value)
    if (isDisabled) {
      setIsDisabled(false)
    }
  }

  const handleResultClick = (title: string) => {
    handleNameChange({ target: { value: title } } as React.ChangeEvent<HTMLInputElement>)
    setIsDisabled(true)
  }

  return (
    <div className={styles.formGroupIngredient}>
      <div className="fieldDefault">
        <input
          onChange={handleNameInputChange}
          type="text"
          id="name"
          name="name"
          className={`inputDefault ${ingredient.name.length > 0 ? 'hasText' : ''}`}
          placeholder=" "
          value={ingredient.name}
        />
        <label htmlFor="name" className="labelDefault">Name</label>
        {searchResults.length > 0 && !isDisabled && (
          <ul className={styles.searchResults}>
            {searchResults.map((result) => (
              <li key={result.title} onClick={() => handleResultClick(result.title)}>
                {result.title}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="fieldDefault">
        <input
          onChange={handleAmountChange}
          type="text"
          id="amount"
          name="amount"
          className={`inputDefault ${ingredient.amount.length > 0 ? 'hasText' : ''}`}
          placeholder=" "
          value={ingredient.amount}
        />
      </div>
      <Select onChange={handleUnitChange} label="Unit" options={unitOptions} />
    </div>
  )
}
