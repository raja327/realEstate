import { getAuth, updateProfile } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import {db} from '../firebase'
import { updateDoc,doc, collection, query, where,orderBy, getDocs, deleteDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import {FcHome} from 'react-icons/fc'
import { toast } from 'react-toastify';
import ListingItems from '../components/ListingItems';

export default function Profile() {
  const [changeDetail,setChangeDetail]=useState()
  const [listings,setListings]=useState(null)
  const [loading,setLoading]=useState(true)
  const navigate=useNavigate("")
  const auth=getAuth()
  const [formData,setFormData]=useState({
    name:auth.currentUser.displayName,
    email:auth.currentUser.email
  });

  const {name,email}=formData
  const onLogOut=()=>{
    auth.signOut();
    navigate("/")
  }
  const onChange=(e)=>{
    setFormData((prevState)=>
    ({
      ...prevState,[e.target.id]:e.target.value,
    }))
  }
  const onSubmit=async()=>{
    try {
      if(auth.currentUser.displayName !==name){
        // update displayname in firebase auth
        await updateProfile(auth.currentUser,{displayName:name})
        //update name in the firestore
        const docRef=doc(db,"users",auth.currentUser.uid)
        await updateDoc(docRef,{
          name
        })
      }
      toast.success("profile details updated")
    } catch (error) {
     toast.error("couldn't update the profile details") 
    }
  }

  useEffect(()=>{
    const fetchUserListing=async()=>{
   
      const listingRef=collection(db,"listing")
      const q=query(listingRef,where("userRef","==",auth.currentUser.uid),orderBy("timestamp","desc"))
      const querySnap=await getDocs(q);
      let listings=[];
      querySnap.forEach((doc)=>{
        return listings.push({
          id:doc.id,
          data:doc.data(),
        })
      })
      setListings(listings)
      setLoading(false)
    }
    fetchUserListing()
  },[auth.currentUser.uid])

  const onDelete=async(listingID)=>{
    if(window.confirm("Are you sure you want to delete ?")){
      await deleteDoc(doc(db,"listing",listingID))
      const updatedListing=listings.filter((listing)=>listing.id!==listingID)
      setListings(updatedListing)
      toast.success("Successfully deleted the listing")
    }
  }
  const onEdit=(listingID)=>{
    navigate(`/edit-listing/${listingID}`)
  }
  return (
    <>
    <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
      <h1 className='text-3xl text-center mt-6 font-bold'>My Profile</h1>
      <div className="w-full md:w-[50%] mt-6 px-3">
        <form>
          {/* name input */}
          <input 
          type="text" 
          id="name" 
          value={name} 
          className={`w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out mb-6 ${changeDetail && "bg-pink-200 focus:bg-pink-200"}`}
          disabled={!changeDetail}
          onChange={onChange}/>
          
          <input 
          type="email" 
          id="email" 
          value={email} 
          className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out mb-6'
          disabled={!changeDetail}/>
          <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6">
            <p className='flex items-center '>Do you want to change your name?<span 
            onClick={()=>{changeDetail && onSubmit(); 
            setChangeDetail((prevState)=>!prevState)
            }}
            className='text-pink-600 hover:text-pink-700 transition ease-in-out duration-200 ml-1 cursor-pointer'>
              {changeDetail ? "Apply Change":"Edit"}
              </span></p>
            <p onClick={onLogOut} className='text-blue-700 hover:text-blue-800 transition ease-in-out cursor-pointer'>Sign Out</p>
          </div>
        </form>
        <button type='submit' className='w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition ease-in-out duration-150 hover:shadow-lg active:bg-blue-800'>
          <Link to="/create-listing" className='flex justify-center items-center'>
            <FcHome className='mr-2 text-3xl bg-red-200 rounded-full p-1 border-2'/>
            Sell or Rent Your Home
          </Link>
          </button>
      </div>
    </section>
    <div className='max-w-6xl px-3 mt-6 mx-auto'>
      {!loading && listings.length>0 &&(
        <>
        <h2 className='text-2xl text-center font-semibold mb-6'>My Listing</h2>
        <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6'>
          {listings.map((listing)=>(
            <ListingItems 
            key={listing.id} 
            id={listing.id} 
            listing={listing.data}
            onDelete={()=>onDelete(listing.id)} 
            onEdit={()=>onEdit(listing.id)} 
            />
          ))}
        </ul>
        </>
      )}
    </div>
    </>
  )
}  
