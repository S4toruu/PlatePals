import Link from 'next/link'
import React from 'react'
import styles from './button.module.scss'

export interface ButtonProps {
  href: string
  target?: string
  fill?: boolean | null
  disabled?: boolean | null
  color?: string
  modifier?: string[]
  children: React.ReactNode
  onButtonClick?: () => void | Promise<any[]>
}

export function Button({
  href, target, fill, color, onButtonClick, children, modifier, disabled
}: ButtonProps) {
  const classes = [styles.buttonDefault]

  if (fill) {
    classes.push(styles.fill)
  }
  if (color && !disabled) {
    classes.push(styles[color])
  } else if (disabled) {
    classes.push(styles.disabled)
  } else {
    classes.push(styles.orange)
  }
  if (modifier) {
    modifier.forEach((mod) => {
      classes.push(styles[mod])
    })
  }

  const clickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    onButtonClick()
  }

  return (!href ? (
    <button
      type="button"
      className={classes.join(' ')}
      onClick={(event) => { clickHandler(event) }}
    >
      {children}
    </button>
  ) : (
    <Link
      className={classes.join(' ')}
      target={target}
      href={href}
    >
      {children}
    </Link>
  ))
}
