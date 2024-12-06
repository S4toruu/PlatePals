import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react'
import { Button } from 'components/atoms/button'

import styles from './card-login.module.scss'

interface CardLoginProps {
  type?: string
  callback?: string
}

export function CardLogin({ type, callback }: CardLoginProps) {
  const [mail, setMail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const router = useRouter()

  const classes = [styles.cardLogin]

  if (type === 'shadow') {
    classes.push(styles.shadow)
  }
  if (type === 'checkout') {
    classes.push(styles.checkout)
  }

  const handleMailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMail(event.target.value)
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const login = async (): Promise<any> => {
    await signIn('credentials', {
      mail,
      password
    })
    if (callback) {
      router.push(callback)
    }
  }

  const register = async (): Promise<any> => {
    const res = await fetch('/api/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mail,
        password
      })
    })
    if (res.status === 201) {
      await signIn('credentials', {
        mail,
        password
      })
      if (callback) {
        router.push(callback)
      }
    }
  }

  return (
    <div className={classes.join(' ')}>
      <div className="formElement">
        <div className="fieldDefault">
          <input
            onChange={handleMailChange}
            type="text"
            id="mail"
            name="mail"
            className={`inputDefault ${mail.length > 0 ? 'hasText' : ''}`}
            placeholder=" "
            value={mail}
          />
          <label
            htmlFor="mail"
            className="labelDefault"
          >
            E-mail
          </label>
        </div>
      </div>
      <div className="formElement">
        <div className="fieldDefault">
          <input
            onChange={handlePasswordChange}
            type="password"
            id="password"
            name="password"
            className={`inputDefault ${password.length > 0 ? 'hasText' : ''}`}
            placeholder=" "
            value={password}
          />
          <label
            htmlFor="password"
            className="labelDefault"
          >
            Password
          </label>
        </div>
      </div>
      <Button
        color="dark-grey"
        target="_self"
        href={null}
        fill
        onButtonClick={() => login()}
      >
        Login
      </Button>
      <Button
        color="dark-grey"
        target="_self"
        href={null}
        onButtonClick={() => register()}
      >
        Register
      </Button>
    </div>
  )
}
