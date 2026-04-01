
import doctorModel from "../models/DoctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/AppointmentModel.js";

// availability route functionality
const changeAvailablity = async (req, res) => {

  try {

    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);

    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available
    });

    res.json({ success: true, message: "Availability Changed" });

  } catch (error) {

    console.log(error);

    res.json({ success: false, message: error.message });

  }

}

// const changeAvailablity = async (req, res) => {
//   try {

    // const { docId } = req.body;

    // console.log("docId:", docId);   // 🔍 debug

    // const docData = await doctorModel.findById(docId);

    // if (!docData) {
    //   return res.json({
    //     success: false,
    //     message: "Doctor not found"
    //   });
    // }

  //   await doctorModel.findByIdAndUpdate(docId, {
  //     available: !docData.available
  //   });

  //   res.json({ success: true, message: "Availability Changed" });

  // } catch (error) {
  //   console.log(error);
  //   res.json({ success: false, message: error.message });
  // }
// };



const doctorList = async (req, res) =>{
  try{

    const doctors = await doctorModel.find({}).select(['-password', '-email'])
    res.json({success:true, doctors})

  } catch( error){
     console.log(error);

    res.json({ success: false, message: error.message });

  }
}

//APIfor doctor login
const loginDoctor = async (req, res) =>{
  try{

    const {email, password} = req.body;

    const doctor = await doctorModel.findOne({email})
    if(!doctor){
      return res.json({success:false, message: 'Invalid credentials'})
    }

    const isMatch = await bcrypt.compare(password, doctor.password)
   if(isMatch){
    const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET)
    res.json({success: true,token})
   } else{
    res.json({success:false, message: 'Invalid credentials'})

   }

  } catch (error){
    console.log(error)
     res.json({ success: false, message: error.message });
  }
}


//API to get doctor appointment for doctor panal
// const appointmentsDoctor = async (req, res) => {
//   try {
//     // const docId = req.docId; // ✅ now this will be defined
//     const {docId} = req.body;
//     const appointments = await appointmentModel.find({ docId });

//     res.json({ success: true, appointments });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

 const appointmentsDoctor = async (req, res) => {
  try {
    const docId = req.user?.docId; // get from authDoctor

    if (!docId) {
      return res.status(400).json({ success: false, message: "Doctor not authenticated" });
    }

    const appointments = await appointmentModel.find({ docId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


//API to mark appointment completed for the doctor panal
const appointmentComplete = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    //
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // update status
    appointment.isCompleted = true;
    await appointment.save();

    res.json({ success: true, message: "Appointment Completed" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


  

//API to mark appointment completed for the doctor panal
const appointmentCancel = async (req, res) => {
  try {
    const docId = req.user.docId; //
    const { appointmentId } = req.body;

    //  correct method
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    //  check doctor ownership
    if (appointmentData.docId.toString() !== docId.toString()) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    //  update
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    res.json({ success: true, message: "Appointment Cancelled" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


//API to get dashboard data for doctor panal
const doctorDashboard = async (req, res) =>{
  try{

    const docId = req.user.docId; 
    const appointments = await appointmentModel.find({docId})

    let earnings = 0

    appointments.map((item) =>{
      if(item.isCompleted || item.payment){
        earnings += item.amount
      }
    })

    let patients = []

    appointments.map((item) =>{
      if(!patients.includes(item.userId)){
        patients.push(item.userId)
      }
    })

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0,5)
    }

    res.json({success: true, dashData})


  } catch(error){
     console.log(error);
    res.json({ success: false, message: error.message });

  }
} 


//API to get doctor profile for doctor panal
const doctorProfile = async(req, res) =>{

  try{
    const docId = req.user.docId; 
    const profileData = await doctorModel.findById(docId).select('-password')

    res.json({success: true, profileData})

  } catch(error){
     console.log(error);
    res.json({ success: false, message: error.message });

  }
}

//API to update doctor data from doctor panal
const updateDoctorProfile = async (req, res) =>{
  try{

     const docId = req.user.docId; 
     const {fees, address, available} = req.body;

     await doctorModel.findByIdAndUpdate(docId, {fees, address, available})

     res.json({success: true, message:"Profile updated"})


  } catch(error){
      console.log(error);
    res.json({ success: false, message: error.message });


  }
}



export { changeAvailablity, doctorList, loginDoctor, appointmentsDoctor, appointmentCancel,
   appointmentComplete , doctorDashboard, doctorProfile, updateDoctorProfile }