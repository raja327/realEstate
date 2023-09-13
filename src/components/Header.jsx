import { useLocation,useNavigate} from "react-router-dom";
import logo from "../assets/rpit.png";
import { useEffect, useState } from "react";
// import { useEffect } from "react";
import {getAuth, onAuthStateChanged} from 'firebase/auth'
export default function Header() {
  const [pageState,setPageState]=useState("Sign In")
  const auth=getAuth()
  useEffect(()=>{
    onAuthStateChanged(auth,(user)=>{
      if(user){
        setPageState("Profile")
      }else{setPageState("Sign In")}
    })
  },[auth])
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location)
  const matchPath=(route)=>{
    if(route===location.pathname){
     return true
    }
  } 
  
  const activeClass="text-pink-600 border-b-pink-500"

  return (
    <div className="bg-white border-b shadow-sm sticky top-0 z-40">
      <header className="flex justify-between items-center px-3  max-w-6xl mx-auto">
        <div className="flex items-center text-2xl font-bold space-x-3">
          <img 
          onClick={()=>navigate('/')}
          src={logo} 
          alt="logo"
          className="cursor-pointer h-10 " />
          <span>Rp<span className="text-pink-600 ">IT</span> </span>
        </div>
        <div>
          <ul className="flex space-x-10">
            <li 
            onClick={()=>navigate('/')}
            className={`py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${matchPath('/') && `${activeClass}`}`}
            >Home</li>

            <li  className={`py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${matchPath('/offers') && `${activeClass}`}`}
            onClick={()=>{navigate('/offers')}}
            >Offers</li>
 
            <li 
             className={`py-3 text-sm font-semibold text-gray-400 border-b-[3px] 
             border-b-transparent ${(matchPath('/sign-in') || matchPath('/profile')) && `${activeClass}`}`}
            onClick={()=>{navigate('/profile')}}
            >{pageState}</li>
          </ul>
        </div>
      </header>
    </div>
  );
}