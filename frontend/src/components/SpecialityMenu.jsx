// import React from 'react'
// import { specialityData } from '../assets/assets'
// import { Link } from 'react-router-dom'

// const SpecialityMenu = () => {
//   return (
//     <div className='flex flex-col items-center gap-4 p-16 text-gray-800' id="speciality">
//       <h1 className='text-3xl font-medium'>Find by Speciality</h1>
//       <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>

//       <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll'>
//         {specialityData.map((item, idx) => (
//           <Link className='flex flex-col text-xs items-center cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all dur<div className='w-full grid grid-cols-auto gap-4 gap-y-6'><div className='w-full grid grid-cols-auto gap-4 gap-y-6'><div className='w-full grid grid-cols-auto gap-4 gap-y-6'><div className='w-full grid grid-cols-auto gap-4 gap-y-6'><div className='w-full grid grid-cols-auto gap-4 gap-y-6'><div className='w-full grid grid-cols-auto gap-4 gap-y-6'><div className='w-full grid grid-cols-auto gap-4 gap-y-6'><div className='w-full grid grid-cols-auto gap-4 gap-y-6'><div className='w-full grid grid-cols-auto gap-4 gap-y-6'><div className='w-full grid grid-cols-auto gap-4 gap-y-6'><div className='w-full grid grid-cols-auto gap-4 gap-y-6'><div className='w-full grid grid-cols-auto gap-4 gap-y-6'><div className='w-full grid grid-cols-auto gap-4 gap-y-6'><div className='w-full grid grid-cols-auto gap-4 gap-y-6'><div className='w-full grid grid-cols-auto gap-4 gap-y-6'><div className='w-full grid grid-cols-auto gap-4 gap-y-6'><div className='w-full grid grid-cols-auto gap-4 gap-y-6'><div className='w-full grid grid-cols-auto gap-4 gap-y-6'><div className='w-full grid grid-cols-auto gap-4 gap-y-6'><div className='w-full grid grid-cols-auto gap-4 gap-y-6'><div className='w-full grid grid-cols-auto gap-4 gap-y-6'><div className='w-full grid grid-cols-auto gap-4 gap-y-6'><div className='w-full grid grid-cols-auto gap-4 gap-y-6'><div className='w-full grid grid-cols-auto gap-4 gap-y-6'><div className='w-full grid grid-cols-auto gap-4 gap-y-6'> ' key={idx} to={`/doctors/${item.speciality}`}>
//             <img className='w-16 sm:w-24 mb-2' src={item.image} alt="" />
//             <p>{item.speciality}</p>
//           </Link>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default SpecialityMenu

import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
  return (
    <div className='flex flex-col items-center gap-4 p-16 text-gray-800' id="speciality">
      <h1 className='text-3xl font-medium'>Find by Speciality</h1>

      <p className='sm:w-1/3 text-center text-sm'>
        Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
      </p>

      <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-x-scroll'>
        {specialityData.map((item, idx) => (
          <Link
            key={idx}
            to={`/doctors/${item.speciality}`}
            className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:-translate-y-2 transition-all duration-300'
          >
            <img className='w-16 sm:w-24 mb-2' src={item.image} alt={item.speciality} />
            <p>{item.speciality}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SpecialityMenu