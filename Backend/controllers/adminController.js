import validator from "validator"
import bcrypt from "bcrypt"
import {v2 as cloudinary} from "cloudinary"
import doctorModel from "../models/DoctorModel.js"
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/AppointmentModel.js"
import userModel from "../models/userModel.js"

// adminController.js

// export const addDoctor = (req, res) => {
//   console.log("req.body:", req.body);
//   console.log("req.file:", req.file);
//   res.json({ success: true, message: "Debug" });
// };

//API for adding doctor
const addDoctor = async (req, res) => {
  try {
    // console.log("Data received from Postman:", req.body);
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
    const imageFile = req.file;

    // Check for all data to add doctor  required fields
    if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
      return res.status(400).json({success: false, message:"Missing Details"})
    }

    // Validate email
    if(!validator.isEmail(email.trim())){
      return res.status(400).json({success: false, message: "Please enter a valid email"})
    }

    // Validate password length
    if(password.length < 8){
      return res.status(400).json({success: false, message: "Password must be at least 8 characters"})
    }

    // Check if file is uploaded
    if(!imageFile){
      return res.status(400).json({success: false, message: "Please upload an image"})
      
    }

    // Hash doctor password (to encrypt the password)
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Upload image to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: "image"})
    const imageUrl = imageUpload.secure_url

    // Save doctor to DB
    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address:JSON.parse(address), // keep as string
      date: Date.now()
    }

    const newDoctor = new doctorModel(doctorData)
    await newDoctor.save()

    res.status(201).json({success: true, message:"Doctor added"})
  } catch (error) {
    console.error(error)
    res.status(500).json({error: "Something went wrong"})
  }
}


// API for admin login

const loginAdmin = async(req, res)=>{
  try{
    const {email, password} = req.body;
    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){

      const token = jwt.sign(email+password, process.env.JWT_SECRET)
      res.json({success:true,token}); 


    }else{
    res.json({success:false,message:"Invalid credentials"})
  }


  } catch(error){
    console.error(error)
    res.status(500).json({error: "Something went wrong"})

  } 
}

//API to get all doctors list for admin panel
const allDoctors  = async (req, res) =>{

  try{
    const doctors = await doctorModel.find({}).select('-password')
    res.json({success: true, doctors});

  } catch (error){
    console.log(error)
    res.json({success:false, message:error.message});
  }
}

//API to get all apointment list
const appointmentsAdmin = async (req, res) =>{
  try{
    const appointments = await appointmentModel.find({})
    res.json({success: true, appointments})

  } catch (error){
    console.log(error)
    res.json({success: false, message:error.message})

  }
}

//API for appoinment  cancelletion

const appointmentCancel = async(req, res) =>{
  try{

     const {appointmentId} = req.body;

     const appointmentData = await appointmentModel.findById(appointmentId)

  
     

   await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true})

   // releasing dr slot
   const {docId, slotDate, slotTime} = appointmentData

   // get doctors data
   const doctorData = await doctorModel.findById(docId)

   let slots_booked = doctorData.slots_booked // fetch doctors booked slots

   slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

   await  doctorModel.findByIdAndUpdate(docId, {slots_booked})

 res.json({success: true, message: 'Appointment Cancelled'})

  } catch (error){
    console.log(error)
    res.json({success: false, message: error.message})


  }
}
// API to get dashboard data for admin panal
const adminDashboard = async (req, res) =>{

  try{
    const doctors = await doctorModel.find({})
    const users = await userModel.find({})
    const appointment = await appointmentModel.find({})

    const dashData ={
      doctors: doctors.length,
      appointments: appointment.length,
      patients: users.length,
      latestAppointments: appointment.reverse().slice(0,5)
    }

    res.json({success:true, dashData})



  } catch (error){
    console.log(error)
    res.json({success: false, message: error.message}

    )
  }
}


export { addDoctor , loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard}