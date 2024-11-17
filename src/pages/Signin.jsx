import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'
import OAuth from '../components/OAuth'
import { FaEyeSlash } from "react-icons/fa6";
import { IoEyeSharp } from "react-icons/io5";


const Signin = () => {
  const [formData, setFormData] = useState({})
  const { loading, error } = useSelector((state) => state.user)
  const [type, setType] = useState(true);
  const changeIcon = type === true ? false : true;


  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(signInStart())
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (data.success === false) {
        dispatch(signInFailure(data.message))
        toast.error(error)
        return
      }
      dispatch(signInSuccess(data))
      toast.success('Successfully Login')
      navigate("/")
    } catch (error) {
      dispatch(signInFailure(error.message));

    }
  }



  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Sign In</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type={type ? "password" : "text"}
              required
              className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your password"
              onChange={handleChange}
            />
          </div>
          <span className="relative -top-7 -right-[350px]" onClick={() => {setType(changeIcon);}}>
          {changeIcon ? <FaEyeSlash /> : <IoEyeSharp />}
          </span>

          <button
            disabled={loading}
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>

          {/* Error Message */}
          {/* {error && (
            <div className="mt-4 text-red-500 text-center bg-red-100 border border-red-300 rounded-md p-2">
              {error}
            </div>
          )} */}
        </form>


        <OAuth/>

        <p className="text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/sign-up" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signin
