import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from "../models/userModel.js"
import jwt from 'jsonwebtoken'
// import userModel from "../models/userModel.js"
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from "../models/DoctorModel.js"
import appointmentModel from '../models/AppointmentModel.js'
 import razorpay from 'razorpay'




  //Api to register user


const registerUser = async (req, res) =>{
    try{

        const {name, email, password} = req.body;
        if(!name || !password || !email) {
            return res.json({success: false, message: "Missing Details"})
        }


        //validating email format
        if(!validator. isEmail(email)){
            return res.json({success:false, message: "enter a valid email"})
        }

        //validating a strong password
        if(password.length < 8){
            return res.json({success:false, message: "enter a strong password"})
        }


        // hasing user password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashPassword
        }


        const newUser = new userModel(userData)
        const user = await newUser.save();

     const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
 
     res.json({success: true, token})


    } catch(error){
        console.log(error);
        res.json({success: false, message:error.message})

    }
}


//API for user login

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "Email and password required" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    
    res.json({
      success: true,
      token
    });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


//API to get user profile data

const getProfile = async(req, res) =>{
  try{
    const userId = req.userId;
    const userData = await userModel.findById(userId).select('-password')

    res.json({success:true, userData})

  }  catch (error){
      console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update userProfile
const updateProfile = async (req, res) => {
  try {
    const userId = req.userId
    const name = req.body.name
    const phone = req.body.phone
    const address = req.body.address
    const dob = req.body.dob
    const gender = req.body.gender
    const imageFile = req.file

    // check required fields
    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data missing" })
    }

    let updateData = {
      name: name,
      phone: phone,
      address: JSON.parse(address),
      dob: dob,
      gender: gender
    }

    // if image exists
    if (imageFile) {
      const result = await cloudinary.uploader.upload(imageFile.path)
      updateData.image = result.secure_url
    }

    // update in database
    await userModel.findByIdAndUpdate(userId, updateData)

    res.json({ success: true, message: "Profile updated" })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to book appointment

const bookAppointment = async(req, res) =>{

  try{
    const userId = req.userId;
    const { docId, slotDate, slotTime} = req.body;

    const docData = await doctorModel.findById(docId).select('-password')

    if (!docData) {
  return res.json({
    success: false,
    message: "Doctor not found"
  })
}



    if(!docData.available){
      return res.json({success: false, message: 'Doctor not available'})
    }
   

    let slots_booked = docData.slots_booked   //get already booked slots

    //checking for slots availablity
    if(slots_booked[slotDate]){  // check if any slots exist fot that Date 
      if(slots_booked[slotDate].includes(slotTime)){
        return res.json({success: false, message: 'Slot not available'})
      } else{
        slots_booked[slotDate].push(slotTime) //time is free add new time slot to  that data
      }

    } else{
      slots_booked[slotDate] = [] //date does not exist create new date entry
      slots_booked[slotDate].push(slotTime) //add slot time
    }

    const userData = await userModel.findById(userId).select('-password')
     
    delete docData.slots_booked

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount:docData.fees,
      slotTime,
      slotDate,
      date:Date.now()
    }

    const newAppointment  = new appointmentModel(appointmentData)
    await newAppointment.save()

    //save new slots data in docData
    await doctorModel.findByIdAndUpdate(docId, {slots_booked})
    res.json({success: true, message: 'Appointment booked'})
    

  } catch(error){
    console.log(error);
    res.json({success: false, message: error.message})
  }
}

// API to get user appointments for frontend my-appointments page 
const listAppointment = async (req, res) =>{
  try{

    
    const userId = req.userId
    const appointments = await appointmentModel.find({userId})

    res.json({success:true, appointments})

  } catch (error){
    console.log(error)
    res.json({success: false, message: error.message})

  }
}

//API to cencel the appointment
const cancelAppointment = async(req, res) =>{
  try{

     const userId = req.userId
     const {appointmentId} = req.body;

     const appointmentData = await appointmentModel.findById(appointmentId)

    //verify appointment user
// only the owner of the appoinment can cenecel it 
     if(appointmentData.userId !== userId){
      return res.json({success: false, message:'Unauthorized action'})
     }

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


// API to make payment of appointment using razorpay 
// const razarpayInstance = new Razorpay({
//   key_id:process.env.RAZORPAY_KEY_ID,
//   key_secret:process.env.RAZORPAY_KEY_SECRET
// })


  const paymentRazorpay = async (req, res) => {
  try {
    const razarpayInstance = new razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({ success: false, message: "Appointment cancelled or not found" });
    }

    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    };

    const order = await razarpayInstance.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyRazorpay = async (req, res) => {
   try {
    const razarpayInstance = new razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const { razorpay_order_id } = req.body;
  const orderInfo = await razarpayInstance.orders.fetch(razorpay_order_id);

  
    if (orderInfo.status === "paid") {
     
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
      res.json({ success: true, message: "Payment Successful" });
    } else {
      res.json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
   }
};


export {registerUser, loginUser , getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment , paymentRazorpay, verifyRazorpay}