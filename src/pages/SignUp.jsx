import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Oauth from "../components/Oauth";
import { getAuth,createUserWithEmailAndPassword,updateProfile } from "firebase/auth";
import {db} from '../firebase'
import { serverTimestamp, setDoc,doc } from "firebase/firestore";
import { toast } from "react-toastify";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(true);
  const [formData, setFormData] = useState({
    name:"",
    email: "",
    password: "",
  });
  const {name, email, password } = formData;
  const navigate=useNavigate()
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
   const Onsubmit=async(e)=>{
    e.preventDefault();
    try {
      const auth=getAuth()
       const userCredential=await createUserWithEmailAndPassword(
        auth,
        email,
        password)
      updateProfile(auth.currentUser,{displayName:name})
       const user=userCredential.user;
       const formDataCopy={...formData}
       delete formDataCopy.password
       formDataCopy.timestamp=serverTimestamp()

       await setDoc(doc(db,"users",user.uid),formDataCopy)
        toast.success("successfully signed up")
        navigate("/")
       } catch (error) {
      toast.error("something went wrong with the registration") 
    }
  }
  return (
    <section>
      <h1 className="text-3xl text-center mt-6 font-bold">Sign Up</h1>
      <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
        {/* div for key image */}
        <div className="md:w-[67%] lg:w-[50%] md:mb-6 ">
          <img
            src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=773&q=80"
            alt="key"
            className="w-full rounded-2xl"
          />
        </div>
        {/* div for form */}
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          <form onSubmit={Onsubmit}>
          <input
              className="w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded-xl transition ease-in-out"
              type="text"
              id="name"
              value={name}
              placeholder="Enter your Full Name"
              onChange={onChange}
            />
            <input
              className="w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded-xl transition ease-in-out"
              type="email"
              id="email"
              value={email}
              placeholder="Enter your email"
              onChange={onChange}
            />
            <div className="relative mb-6">
              <input
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded-xl transition ease-in-out"
                type={showPassword ? "password" : "text"}
                id="password"
                value={password}
                placeholder="Enter Password"
                onChange={onChange}
              />
              {showPassword ? (
                <AiFillEyeInvisible
                  className="absolute right-3 top-3 text-xl cursor-pointer"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              ) : (
                <AiFillEye
                  className="absolute right-3 top-3 text-xl cursor-pointer"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              )}
            </div>
            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">
              <p className="mb-6">
                Have a account ?
                <Link
                  className="text-pink-600 hover:text-pink-700 transition duration-200 ease-in-out ml-1"
                  to="/sign-in"
                >
                  Sign In
                </Link>
              </p>
              <p>
                <Link
                  className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out"
                  to="/forgot-password"
                >
                  Forgot password?
                </Link>
              </p>
            </div>
            <button
              className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800"
              type="submit"
            >
              Sign Up
            </button>
            <div
              className="flex items-center my-4 before:border-t  before:flex-1  before:border-gray-400 
            after:border-t  after:flex-1  after:border-gray-400"
            >
              <p className="text-center font-semibold mx-4">OR</p>
            </div>
            <Oauth/>
          </form>
        </div>
      </div>
    </section>
  );
}
