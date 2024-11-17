import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
const Contact = ({listing}) => {
const [landlord, setLandlord] = useState(null)
const [message, setMessage] = useState('')

const onChange =(e)=>{
    setMessage(e.target.value);
}

useEffect(()=>{

    const fetchLandlord = async()=>{

        try {
            
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        
        if(data.success === false){
            return;
        }
        setLandlord(data)
        
        } catch (error) {
            console.log(error)
        }
        
        }

        fetchLandlord()

},[listing.userRef])




  return (
    <>
    
    {landlord && (
        <div className='flex flex-col gap-3'>
            <p>Contact <span className='font-semibold'>{landlord.username} </span>
            for <span className='font-semibold'> {listing.name.toLowerCase()}</span>
            </p>

            <textarea
        name="message"
        id="message"
        rows="2"
        value={message}
        onChange={onChange}
        placeholder="Enter your message here..."
        className="w-full border border-gray-300 rounded-sm p-2 mt-2"
      ></textarea>

      <Link
        to={`mailto:${landlord.email}?subject=Regarding%20${encodeURIComponent(
          listing.name
        )}&body=${encodeURIComponent(message)}`}
        className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
      >
        Send Message
      </Link>
        </div>
    )}
    
    
    </>
  )
}

export default Contact