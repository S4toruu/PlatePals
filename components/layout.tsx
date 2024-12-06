import React from 'react'
import { Header } from 'components/molecules/header'

export interface LayoutProps {
  children?: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="layout-default">
      <Header />
      <main className="container mx-auto">{children}</main>
    </div>
  )
}
