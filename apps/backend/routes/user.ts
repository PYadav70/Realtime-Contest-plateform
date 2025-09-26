import { Router } from "express";
import { client } from "db/client";
import { signupSchema } from "../types";
import jwt, { type JwtPayload } from "jsonwebtoken"
import { sendEmail } from "../mail";

const router = Router();

// router.post("/signup", async (req,res)=>{
   

// })

router.post("/signin", async(req,res)=>{
     const {success, data} = signupSchema.safeParse(req.body);

    if(!success){
        res.status(411).json({
            message:"Incorrect email format"
        })
    }
  if (!data?.email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user =  await client.user.upsert({
    create:{
        email: data.email,
        role: "User"
    },
    update:{},
    where:{
        email: data.email
    }
  });

  const token  =jwt.sign({
    userId : user.id

  }, process.env.EMAIL_JWT_PASSWORD!);

  if(process.env.NODE_ENV === "production"){
    await sendEmail(data.email, `Login to Contest plateform`, `click this link to login ${process.env.FRONTEND_URL!}/user/login/post?token=${token}`)
  }else{
    console.log(`The link for ${data.email} to login is  https://localhost:4000/user/login/post?token=${token}`)
  }
  res.json({
    message:"we have emailed the one time login link to you, please check your email"
  })

})

router.get("/signin/post", async(req, res)=>{
    try {
        const token = req.query.token as string;
        const decoded = jwt.verify(token, process.env.EMAIL_JWT_PASSWORD!) as JwtPayload
        if(decoded.userId){
            const token = jwt.sign({
                userId: decoded.userId
            },process.env.USER_JWT_PASSWORD!);
            res.json({
                token
            })
        }else{
            res.status(411).json({
                message: "Incorrect token"
            })
        }
    } catch (error) {
         res.status(411).json({
                message: "Incorrect token"
            })
    }
})


export default router;