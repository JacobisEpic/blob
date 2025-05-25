'use client'

import { ProfileMenu } from './ProfileMenu'
import { NextBlobTimer } from './NextBlobTimer'
import { PreviousWinner } from './PreviousWinner'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Blob</h1>
        <div className="flex items-center gap-4">
          <PreviousWinner />
          <NextBlobTimer />
          <ProfileMenu />
        </div>
      </div>
    </header>
  )
} 