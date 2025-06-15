"use client"
import { useSession, signOut } from 'next-auth/react';
import React from 'react'

const Navbar = () => {
    const session = useSession();
    const admin = session.data?.user;
    if (session) {
        return (
            <div className='bg-gray-300 h-fit w-full flex justify-between p-5 '>
                {admin?.name}
                {session.status==='authenticated' && <button className='cursor-pointer text-red-500' onClick={() => { signOut() }}>Logout</button>}
            </div>
        )
    }
}

export default Navbar


