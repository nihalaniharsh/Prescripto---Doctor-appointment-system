// import jwt from'jsonwebtoken'

// //Doctor authentication middleware
// const authDoctor = async (req, res, next)=>{
//     try{

//       const {dtoken}  = req.headers
//       if(!dtoken){
//         return res.json({success:false, message:'Not Authorized Login again'})
//       }
//       const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET)
//       req.body.docId  = token_decode.id

//     //   req.userId = decoded.id;
//       next();

//     } catch(error){
//         console.log(error)
//         res.json({success:false, message:error.message})

//      }


// }

// export default authDoctor


import jwt from'jsonwebtoken'
 const authDoctor = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Initialize req.user first
    req.user = {};
    req.user.docId = decoded.id; // now safe
    req.user.name = decoded.name; // optional

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default authDoctor