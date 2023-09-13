
import { useEffect, useState } from "react";
import Slider from "../components/Slider";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";
import ListingItems from "../components/ListingItems"
import { Link } from "react-router-dom";
export default function Home() {
  // offers 
  const [offerListings,setOfferListings]=useState(null)

  useEffect(()=>{
    const fetchListing=async()=>{
      try {
        //get reference 
        const listingsRef=collection(db,"listing")
        //create the query 
        const q=query(listingsRef,where("offer","==",true),orderBy("timestamp","desc"),limit(4))
        //execute the query 
        const querySnap=await getDocs(q)
        let listings=[]
        querySnap.forEach((doc)=>{
          return listings.push({
            id:doc.id,
            data:doc.data() 
          })
        })
        setOfferListings(listings)
        console.log(listings)
      } catch (error) {
        console.log(error)
      }
    }
    fetchListing()
  },[])

  // places for rent
  const [rentListings,setRentListings]=useState(null)

  useEffect(()=>{
    const fetchListing=async()=>{
      try {
        //get reference 
        const listingsRef=collection(db,"listing")
        //create the query 
        const q=query(listingsRef,where("type","==","rent"),orderBy("timestamp","desc"),limit(4))
        //execute the query 
        const querySnap=await getDocs(q)
        let listings=[]
        querySnap.forEach((doc)=>{
          return listings.push({
            id:doc.id,
            data:doc.data() 
          })
        })
        setRentListings(listings)
        console.log(listings)
      } catch (error) {
        console.log(error)
      }
    }
    fetchListing()
  },[])
  // places for sell
  const [saleListings,setSaleListings]=useState(null)

  useEffect(()=>{
    const fetchListing=async()=>{
      try {
        //get reference 
        const listingsRef=collection(db,"listing")
        //create the query 
        const q=query(listingsRef,where("type","==","sale"),orderBy("timestamp","desc"),limit(4))
        //execute the query 
        const querySnap=await getDocs(q)
        let listings=[]
        querySnap.forEach((doc)=>{
          return listings.push({
            id:doc.id,
            data:doc.data() 
          })
        })
        setSaleListings(listings)
        console.log(listings)
      } catch (error) {
        console.log(error)
      }
    }
    fetchListing()
  },[])
  return (
    <div>
      <Slider />
      <div className="max-w-6xl mx-auto pt-4 space-y-6">
      {offerListings && offerListings.length >0 &&(
      <div className="m-2 mb-6">
        <h2 className="px-3 text-2xl mt-6 font-semibold">Recent Offers</h2>
        <Link to="/offers">
          <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">show more offers</p>
        </Link>
        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {offerListings.map((listing)=>(
            <ListingItems key={listing.id} listing={listing.data}/>
          ))}
        </ul>
      </div>
     )}
      {rentListings && rentListings.length >0 &&(
      <div className="m-2 mb-6">
        <h2 className="px-3 text-2xl mt-6 font-semibold">Places for rent</h2>
        <Link to="/category/rent">
          <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">show more places for rent</p>
        </Link>
        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rentListings.map((listing)=>(
            <ListingItems key={listing.id} listing={listing.data}/>
          ))}
        </ul>
      </div>
     )}
      {saleListings && saleListings.length >0 &&(
      <div className="m-2 mb-6">
        <h2 className="px-3 text-2xl mt-6 font-semibold">Places for sale</h2>
        <Link to="/category/sale">
          <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">show more places for sale</p>
        </Link>
        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {saleListings.map((listing)=>(
            <ListingItems key={listing.id} listing={listing.data}/>
          ))}
        </ul>
      </div>
     )}
      </div>
     
    </div>
  );
}
