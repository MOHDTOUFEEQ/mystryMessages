'use client'    
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail'
import React from 'react'
function page() {
  const handleSendVerificationEmail = async () => {
    const response = await sendVerificationEmail('mohdtoufeeq1448@gmail.com', 'toufeeq', '123456')
    console.log(response)
  }
    return (
    <>
    <button onClick={handleSendVerificationEmail}>Send Verification Email</button>
    </>
  )
}

export default page