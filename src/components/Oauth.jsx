import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { getDoc,doc,serverTimestamp, setDoc } from 'firebase/firestore'
import React from 'react'
import {FcGoogle} from 'react-icons/fc'
import { toast } from 'react-toastify'
import { db } from '../firebase'
import { useNavigate } from 'react-router'
export default function Oauth() {
  const navigate=useNavigate()
  const onGoogleClick=async()=>{
    try {
      const auth=getAuth()
      const provider=new GoogleAuthProvider()
      const result=await signInWithPopup(auth,provider)
      const user=result.user
      // check for the user
      const docRef=doc(db,"users",user.uid)
      const docSnap=await getDoc(docRef)
      if(!docSnap.exists()){
        await setDoc(docRef,{
          name:user.displayName,
        email:user.email,
      timestamp:serverTimestamp()})
      }
      toast.success("successfully registered")
      navigate('/')
    } catch (error) {
      toast.error("couldn't authorized with google")
    }
  }
  return (
    <button type='button' onClick={onGoogleClick} 
     className='w-full flex justify-center items-center bg-pink-700 text-white px-7 py-3 uppercase text-sm font-medium hover:bg-pink-800
    active:bg-pink-900
    shadow-md
    hover:shadow-lg
    active:shadow-lg
    transition duration-1000 ease-in-out rounded'>
      <FcGoogle className='text-2xl bg-white rounded-full mr-2'/> Continue with Google
    </button>
  )
}
