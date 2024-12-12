import React from 'react'

import { useFormRecipe } from 'context/form-recipe-context'
import { FormGroupIngredient } from 'components/molecules/form-group-ingredient'
import { Button } from 'components/atoms/button'
import { Select } from 'components/atoms/select'
import styles from './form-recipe.module.scss'

export function FormRecipe() {
  const typeOptions:any = [
    { id: 'cookies', name: 'Cookies' },
    { id: 'starters', name: 'Starters' }
  ]
  const {
    title,
    description,
    ingredients,
    servings,
    type,
    handleTitleChange,
    handleDescChange,
    handleServChange,
    handleTypeChange,
    setIngredients,
    handleIngredientNameChange,
    handleIngredientUnitChange,
    handleIngredientAmountChange,
    validateForm,
    getError
  } = useFormRecipe()

  const createRecipe = async () => {
    if (validateForm()) {
      console.log('create recipe')
      await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          servings,
          type,
          ingredients
        })
      })
      // todo display error message and redirect on success
    }
  }

  return (
    <div className={styles.formRecipe}>
      <h1>New Recipe</h1>
      <div className="formElement">
        <div className="fieldDefault">
          <input
            onChange={handleTitleChange}
            type="text"
            id="title"
            name="title"
            className={`inputDefault ${title.length > 0 ? 'hasText' : ''}`}
            placeholder=" "
            value={title}
          />
          <label
            htmlFor="title"
            className="labelDefault"
          >
            Title
          </label>
        </div>
        {getError('title') && <div className={styles.errorItem}>{getError('title')}</div>}
      </div>
      <div className="formElement">
        <div className="fieldDefault">
          <input
            onChange={handleDescChange}
            type="text"
            id="description"
            name="description"
            className={`inputDefault ${description.length > 0 ? 'hasText' : ''}`}
            placeholder=" "
            value={description}
          />
          <label
            htmlFor="description"
            className="labelDefault"
          >
            Description
          </label>
        </div>
        {getError('description') && <div className={styles.errorItem}>{getError('description')}</div>}
      </div>
      <div className="formElement">
        <div className="fieldDefault">
          <input
            onChange={handleServChange}
            type="text"
            id="servings"
            name="servings"
            className={`inputDefault ${servings.length > 0 ? 'hasText' : ''}`}
            placeholder=" "
            value={servings}
          />
          <label
            htmlFor="servings"
            className="labelDefault"
          >
            Servings
          </label>
        </div>
        {getError('servings') && <div className={styles.errorItem}>{getError('servings')}</div>}
      </div>
      <Select onChange={handleTypeChange} label="Type of Recipe" options={typeOptions} />
      <div className="formElement">
        {ingredients.map((ingredient, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={`ing-${index}`}>
            <FormGroupIngredient
              ingredient={ingredient}
              handleNameChange={handleIngredientNameChange(index)}
              handleUnitChange={handleIngredientUnitChange(index)}
              handleAmountChange={handleIngredientAmountChange(index)}
            />
            {getError(`ing-${index + 1}`) && <div className={styles.errorItem}>{getError(`ing-${index + 1}`)}</div>}
          </div>
        ))}
        <Button
          target="_self"
          color="dark-grey"
          href={null}
          onButtonClick={() => setIngredients([...ingredients, { name: '', unit: '', amount: '' }])}
        >
          Add ingredient
        </Button>
      </div>
      <div className={styles.formElement}>
        <Button
          target="_self"
          href={null}
          fill
          onButtonClick={() => createRecipe()}
        >
          Save
        </Button>
      </div>
    </div>
  )
}
