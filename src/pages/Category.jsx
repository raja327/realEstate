import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {collection, getDocs, limit, orderBy, query, startAfter, where} from "firebase/firestore"
import {db} from '../firebase'
import Spinner from '../components/Spinner'
import ListingItems from '../components/ListingItems'
import { useParams } from 'react-router-dom'

export default function Category() {
  const [listings,setListings]=useState(null)
  const [loading,setLoading]=useState(true)
  const [lastFetchedListing,setLastFetchedListing]=useState(null)
  const params=useParams()
  useEffect(()=>{
    const fetchListing=async()=>{
      try {
      const listingRef=collection(db,"listing")
      const q=query(listingRef,where("type","==",params.categoryName),orderBy("timestamp","desc"),limit(8))
      const querySnap=await getDocs(q)
      const lastVisible=querySnap.docs[querySnap.docs.length-1 ]
      setLastFetchedListing(lastVisible)
      let listings=[]
      querySnap.forEach((doc)=>{
        return listings.push({
          id:doc.id,
          data:doc.data()
        })
      })
      setListings(listings)
      setLoading(false)
      } catch (error) {
        toast.error("could not fetch listing")
      }
    }
    fetchListing()
  })
  const onFetchMoreListing=async()=>{
    try {
      const listingRef=collection(db,"listing")
      const q=query(
        listingRef,
        where("type","==",params.categoryName),
        orderBy("timestamp","desc"),
        startAfter(lastFetchedListing),
        limit(4)
      );
      const querySnap=await getDocs(q)
      const lastVisible=querySnap.docs[querySnap.docs.length-1 ]
      setLastFetchedListing(lastVisible)
      let listings=[]
      querySnap.forEach((doc)=>{
        return listings.push({
          id:doc.id,
          data:doc.data()
        })
      })
      setListings((prevState)=>[...prevState,...listings])
      setLoading(false)
      } catch (error) {
        toast.error("could not fetch listing")
      }
  }

  return <div className='max-w-6xl mx-auto px-3'>
    <h1 className='text-3xl text-center mt-6 font-bold mb-6'>{params.categoryName==="rent"? "Places for rent":"Places for sale"}</h1>
    {loading ? (<Spinner/>):(listings && listings.length>0 ?(
    <>
    <main>
      <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
        {listings.map((listing)=>(
          <ListingItems key={listing.id} id={listing.id} listing={listing.data}/>
        ))}
      </ul>
    </main>
    {lastFetchedListing && (
      <div className='flex justify-center items-center'>
        <button onClick={onFetchMoreListing} className='bg-white px-3 py-1.5 text-gray-700 border-gray-300 mb-6 mt-6 hover:border-slate-600 rounded transition duration-150 ease-in-out'>load more</button>
      </div>
    )}
    </>):(
      <p className="flex justify-center font-semibold text-gray-500">There is no current {params.categoryName==="rent" ? "Places for rent":"Places for sale"}</p>
    ))}
  </div>
 
}
