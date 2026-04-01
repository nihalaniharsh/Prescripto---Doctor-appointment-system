import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>

      <div className=' text-center text-2xl pt-10 text-gray-500'>
        <p>CONTACT <span className='text-gray-700 font-medium'>US</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-10 mb-28 text-sm'>
        <img className='w-full max-w-[360px]' src={assets.contact_image} alt="" />
     


      <div className='flex flex-col justify-center items-start gap-6'>
        <p className=' font-semibold text-lg  text-gray-600'>Our OFFICE </p>
        <p className='text-gray-600'>54709 Willms <br />Station Suite 350, Washington, USA</p>
        <p className='text-gray-600'>Tel: (91) 9425665701 <br />Email: harshnihalani904@gmail.com</p>
        <p className=' text-2xl font-semibold text-gray-600'>CAREERS AT PRESCRIPTO</p>
        <p className='text-gray-600'>Learn more about our teams and job openings.</p>
        <button className='text-gray-600 py-4 px-8 border text-sm hover:bg-black hover:text-white transition-all duration-500' >Explore Jobs</button>
      </div>
       </div>

    </div>
  )
}

export default Contact