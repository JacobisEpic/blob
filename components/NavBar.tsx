'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDown, LineChart, LogOut, Plus } from 'lucide-react'
import { Fragment } from 'react'

export default function NavBar() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-xl font-bold text-gray-900 hover:text-brand-600"
            >
              <LineChart className="h-6 w-6" />
              <span>StockShouts</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              href="/post"
              className="btn-primary"
            >
              <Plus className="mr-1 h-4 w-4" />
              New Shout
            </Link>
            
            <Menu as="div" className="relative">
              <Menu.Button className="btn-secondary">
                <span>Account</span>
                <ChevronDown className="ml-1 h-4 w-4" />
              </Menu.Button>
              
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleSignOut}
                        className={`${
                          active ? 'bg-gray-50' : ''
                        } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  )
} 