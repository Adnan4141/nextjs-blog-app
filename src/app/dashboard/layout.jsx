"use client"

import React from 'react'
import Sidebar from './Sidebar'
import { useSession } from 'next-auth/react';
import LoadingSpinner from '@/components/Loading/LoadingSpinner';




const DashboardLayout = ({children}) => {
   const { data: session,status,} = useSession();
  
 if(status=="loading") return <LoadingSpinner/>;

if (session && !session.user) {
  return <p className="text-red-500 p-8">Access denied.</p>;
}

  return (
   <div className="flex min-h-screen   w-full">
      <Sidebar  />
      <main className="w-full pl-20 dark:bg-gray-800 animate-fadeIn">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout
