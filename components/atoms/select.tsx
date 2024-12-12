import React, { useState, useRef, useEffect } from 'react'

import styles from './select.module.scss'

import { Button } from './button'

export interface Option {
  id: string
  name: string
}

interface SelectProps {
  options: any[]
  label: string
  // eslint-disable-next-line no-unused-vars
  onChange: (option: Option) => void
}

export function Select({ options, onChange, label }: SelectProps) {
  const [currentValue, setCurrentValue] = useState<Option>({ id: 'none', name: '- Select Option -' })
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const selectRef = useRef<HTMLDivElement>(null)

  const handleSelectChange = (option: Option) => {
    setCurrentValue(option)
    onChange(option)
    setIsExpanded(false)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      setIsExpanded(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div ref={selectRef} className="relative block min-w-[150px]">
      <Button
        color="transparent"
        target="_self"
        href={null}
        fill
        modifier={['select']}
        onButtonClick={() => setIsExpanded(!isExpanded)}
      >
        {currentValue.id === 'none' ? label : currentValue.name}
      </Button>
      {isExpanded && (
        <div className={styles.selectDropdown}>
          <ul>
            {options.map((option) => (
              <li key={option.id} onClick={() => handleSelectChange(option)}>
                <span>{option.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
