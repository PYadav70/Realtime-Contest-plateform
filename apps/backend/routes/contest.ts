import { Router } from "express";

const router = Router();

router.get("/active", (req,res)=>{
   const {offset, page} = req.query;
})

router.get("/finished", (req,res)=>{
   const {offset, page} = req.query;
})

router.get("/:contestId",(req,res)=>{
    const contestId = req.params.contestId;

})

router.get("/:contestId/:challengeId",(req,res)=>{
    const contestId = req.params.contestId;

})
router.get("/leaderboard/:contestId",(req,res)=>{
    

})

router.post("/submit/:challengeId",(req,res)=>{
   // have rate limiting
   //max 20 submission per problem
   //forward the request to gpt
   //store the response in sorted and the DB

})

export default router;