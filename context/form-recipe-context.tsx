import React, {
  createContext, useContext, useState, useMemo, ReactNode
} from 'react'

import { Option } from 'components/atoms/select'
import { FormIngredient } from 'components/molecules/form-group-ingredient'

interface Error {
  id: string
  message: string
}

interface FormRecipeProps {
  title: string
  description: string
  servings: string
  ingredients: FormIngredient[]
  type: string
  errors: Error[]
  handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleDescChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleServChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleTypeChange: (option: Option) => void
  setIngredients: (ingredients: FormIngredient[]) => void,
  handleIngredientNameChange: (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => void
  handleIngredientAmountChange: (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => void
  handleIngredientUnitChange: (index: number) => (option: Option) => void
  validateForm: () => boolean
  getError: (id: string) => string | undefined
}

const FormRecipeContext = createContext<FormRecipeProps | undefined>(undefined)

export function FormRecipeProvider({ children }: { children: ReactNode }) {
  const [errors, setErrors] = useState<Error[]>([])
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [servings, setServings] = useState<string>('')
  const [type, setType] = useState<string>('')
  const [ingredients, setIngredients] = useState<FormIngredient[]>([{ name: '', unit: '', amount: '' }])

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    if (newValue.length <= 191) {
      setTitle(newValue)
    } else {
      // todo show error message
    }
  }

  const handleDescChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    if (newValue.length <= 191) {
      setDescription(newValue)
    } else {
      // todo show error message
    }
  }

  const handleServChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setServings(newValue)
  }

  const handleTypeChange = (option: Option) => {
    setType(option.name)
  }

  const handleIngredientNameChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    if (newValue.length <= 191) {
      const newIngredients = [...ingredients]
      newIngredients[index].name = newValue
      setIngredients(newIngredients)
    } else {
      // todo show error message
    }
  }

  const handleIngredientUnitChange = (index: number) => (option: Option) => {
    const newIngredients = [...ingredients]
    newIngredients[index].unit = option.id
    setIngredients(newIngredients)
  }

  const handleIngredientAmountChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    const newIngredients = [...ingredients]
    newIngredients[index].amount = newValue
    setIngredients(newIngredients)
  }

  const validateForm = () => {
    const newErrors: Error[] = []

    const addError = (id: string, message: string) => {
      if (!newErrors.some((error) => error.id === id)) {
        newErrors.push({ id, message })
      }
    }

    if (title.length === 0) {
      addError('title', 'Title is required')
    }
    if (description.length === 0) {
      addError('description', 'Description is required')
    }
    if (servings.length === 0 || Number.isNaN(parseInt(servings, 10))) {
      addError('servings', 'Servings must be a valid number')
    }
    if (type.length === 0) {
      addError('type', 'Type is required')
    }
    ingredients.forEach((ingredient, index) => {
      if (ingredient.name.length === 0) {
        addError(`ing-${index + 1}`, `Ingredient ${index + 1} name is required`)
      }
      if (ingredient.unit.length === 0) {
        addError(`ing-${index + 1}`, `Ingredient ${index + 1} unit is required`)
      }
      if (ingredient.amount.length === 0 || Number.isNaN(parseInt(ingredient.amount, 10))) {
        addError(`ing-${index + 1}`, `Ingredient ${index + 1} amount must be a valid number`)
      }
    })

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const getError = (id: string) => errors.find((error) => error.id === id)?.message

  const value = useMemo(() => ({
    title,
    description,
    ingredients,
    servings,
    type,
    errors,
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
  }), [title, description, ingredients, errors, servings, type])

  return (
    <FormRecipeContext.Provider value={value}>
      {children}
    </FormRecipeContext.Provider>
  )
}

export const useFormRecipe = () => {
  const context = useContext(FormRecipeContext)
  if (!context) {
    throw new Error('useFormRecipe must be used within a FormRecipeProvider')
  }
  return context
}
