// break the resume  into the skill or experience and
import fs from 'fs'; // for read the file  data 
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
import askAI from '../services/openRouter.service.js';
import User from '../models/user.model.js'
import Interview from '../models/interview.model.js'

// 1 resume annlysis
export const analyzeResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Resume required" })
        }
        const filepath = req.file.path

        const fileBuffer = await fs.promises.readFile(filepath)
        // convert the  file format which the pdjfs-dist read the file
        const unit8Array = new Uint8Array(fileBuffer)
        // pdf load kara diya 
        const pdf = await pdfjsLib.getDocument({ data: unit8Array }).promise
        // pages ko separate 
        let resumeText = '';

        // Extract text from all pages
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const content = await page.getTextContent();

            const pageText = content.items.map(item => item.str).join(" ");
            resumeText += pageText + '\n';

        }

        resumeText = resumeText
            .replace(/\s+/g, " ")
            .trim();
        // promt 
        const messages = [
            {
                role: "system",
                content: `Extract data from resume.
                Return strictly JSON;
                {
                    "role":"string",
                    "experience": "string",
                    "projects":["project1","project1"],
                    "skills":["skill1" ,"skill2"]
                }
                `
            },
            {
                role: "user",
                content: resumeText
            }

        ];

        const aiResponse = await askAI(messages);
        console.log("AI raw response (before parsing):", aiResponse);

        // attempt to pull out JSON if the model wrapped it in markdown fences or text
        const extractJson = (text) => {
            // look for first { and last } and take substring
            const start = text.indexOf('{');
            const end = text.lastIndexOf('}');
            if (start !== -1 && end !== -1 && end > start) {
                return text.substring(start, end + 1);
            }
            return text;
        };

        let parsed;
        try {
            const maybeJson = extractJson(aiResponse);
            parsed = JSON.parse(maybeJson);
        } catch (err) {
            console.error("Failed to parse AI response as JSON:", err);
            console.error("Raw AI response:", aiResponse);
            return res.status(500).json({ message: "AI did not return valid JSON", aiResponse });
        }

        fs.unlinkSync(filepath)   // delete the filepath => delete from the public folder 

        return res.json({
            role: parsed.role,
            experience: parsed.experience,
            projects: parsed.projects,
            skills: parsed.skills,
            resumeText
        })


    } catch (error) {
        console.error("Interview analysis failed:", error);

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        // respond with the error message so the client can log it
        return res.status(500).json({ message: error.message || 'Unknown error' })
    }
}



// genrate the question
export const generateQuestion = async (req, res) => {
    try {
        let { role, experience, skills, mode, resumeText, projects } = req.body;
        role = role?.trim()
        experience = experience?.trim();
        mode = mode?.trim()

        if (!role || !experience || !mode) {
            return res.status(400).json({
                message: "Role, Experience and Mode are required"
            })
        }
        // find the userId
        const user = await User.findById(req.userId)
        // userId isAuth is mil jayegi from token
        if (!user) {
            return res.status(404).json({ message: "User is not found " })
        }
        if (user.credits < 50) {
            return res.status(400).json({
                message: "Not enough credits.Minimum 50 required. "
            })
        }
        const projectText = Array.isArray(projects) && projects.length ? projects.join(",") : "None";

        const SkillsText = Array.isArray(skills) && skills.length ? skills.join(",") : "None";
        const safeResume = resumeText?.trim() || "None"

        // user prompt
        const userPrompt = `
            Role:${role}
            Experience: ${experience}
            InterviewMode:${mode}
            Projects:${projectText}
            Skills:${SkillsText}
            Resume:${safeResume}
            `

        if (!userPrompt.trim()) {
            return res.status(400).json({
                message: "User Prompt content is empty. "
            })
        }
        // system prompt

        const messages = [

            {
                role: "system",
                content: `
                You are a real human interviewer conducting a professional interview.

                Speak in simple, natural English as if you are directly talking to the candidate.

                Generate exactly 5 interview questions.

                Strict Rules:
                - Each question must contain between 15 and 25 words.
                - Each question must be a single complete sentence.
                - Do NOT number them.
                - Do NOT add explanations.
                - Do NOT add extra text before or after.
                - One question per line only.
                - Keep language simple and conversational.
                - Questions must feel practical and realistic.

                Difficulty progression:
                Question 1 → easy  
                Question 2 → easy  
                Question 3 → medium  
                Question 4 → medium  
                Question 5 → hard  

                Make questions based on the candidates role, experience,interviewMode, projects, skills, and resume details.
                `
            }
            ,
            {
                role: "user",
                content: userPrompt
            }
        ];

        const aiResponse= await askAI(messages);
        if (!aiResponse || !aiResponse.trim()) {
            return res.status(500).json(
                {
                    message:"AI returned empty response"
                }
            )
        }

        const questionArray= aiResponse
            .split(/\n+/)
            .map(q=>q.trim())
            .filter(q=>q.length>0)
            .slice(0,5);

        if(questionArray.length===0){
            return res.status(500).json(
                {
                    message:"AI failed to genrate question"
                }
            )
        }

        user.credits -= 50;

        await user.save();
        // create interview
        const interview= await Interview.create({
            userId: user._id,
            role,
            experience,
            mode,
            resumeText:safeResume,
            questions: questionArray.map((q , index)=>({                
                question:q,
                difficulty:["easy"  , "easy" , "medium" , "medium","hard"][index],
                timeLimits:[60,60,90,90,120][index],
            }
            ))
        })

        if(!interview){
            return res.status(500).json({
                message:"Question is not genrated "
            })
        }
        res.json({
            interviewId:interview._id,
            creditleft:user.credits,
            userName:user.name,
            questions:interview.questions

        })

        console.log("Response sent:", {
            interviewId:interview._id,
            creditleft:user.credits,
            userName:user.name,
            questions:interview.questions
        })

       

    } catch (error) {
        console.error("Question is not genrate by ", error)
        return res.status(500).json({
            message: "Error in the  interview  controller"
        })
    }
}


export  const submitAnswer= async (req, res)=>{
    try {
        const { interviewId , questionIndex, answer, timeTaken}= req.body;

        const interview= await Interview.findById(interviewId)  // find the question id and find the interview

        const question = interview.questions[questionIndex]
        // if no answer
        if(!answer){
            question.score=0;
            question.feedback= "you did not submit an answer";
            question.answer="";

        
        await interview.save();
        return res.json({
            message:"Your  answer is save",
            feedback:question.feedback
        })
        }

        if(timeTaken>question.timeLimits){
            question.score=0;
            question.feedback= "Time Limit exceeded.Answer not evaluated";
            question.answer=answer;

            await interview.save()
            return res.json({
                feedback:question.feedback
        })
        }
        // Submit  Answer Prompt 
    
        const messages = [
            {
                    role: "system",
                    content: `
            You are a professional human interviewer evaluating a candidate's answer in a real interview.

            Evaluate naturally and fairly, like a real person would.

            Score the answer in these areas (0 to 10):

            1. Confidence – Does the answer sound clear, confident, and well-presented?
            2. Communication – Is the language simple, clear, and easy to understand?
            3. Correctness – Is the answer accurate, relevant, and complete?

            Rules:
            - Be realistic and unbiased.
            - Do not give random high scores.
            - If the answer is weak, score low.
            - If the answer is strong and detailed, score high.
            - Consider clarity, structure, and relevance.

            Calculate:
            finalScore = average of confidence, communication, and correctness (rounded to nearest whole number).

            Feedback Rules:
            - Write natural human feedback.
            - 10 to 15 words only.
            - Sound like real interview feedback.
            - Can suggest improvement if needed.
            - Do NOT repeat the question.
            - Do NOT explain scoring.
            - Keep tone professional and honest.

            Return ONLY valid JSON in this format:

            {
            "confidence": number,
            "communication": number,
            "correctness": number,
            "finalScore": number,
            "feedback": "short human feedback"
            }
            `
        }
      ,
      {
        role: "user",
        content: `
        Question: ${question.question}
        Answer: ${answer}
        `
      }
    ];

    const aiResponse= await askAI(messages);

    const parsed= JSON.parse(aiResponse);

    question.answer= answer;
    question.confidence= parsed.confidence;
    question.communication= parsed.communication;
    question.correctness= parsed.correctness;
    question.score= parsed.finalScore;
    question.feedback= parsed.feedback;

    await interview.save();

    return res.status(200).json({
        feedback: parsed.feedback
    })

    } catch (error) {
        console.error("failed to  submit answer Please check the  interview  controller or askAI")
         return res.status(500).json({

            message:` failed to submit answer ${error}`
       
    })
    }
} 



// final score interview and preoapred the  report  

 export const finalInterview= async (req, res)=>{
    try {
        const {interviewId  }= req.body
        const interview= await Interview.findById(interviewId)
        if (!interview) {
            return res.status(400).json({
                message:"failed to find Interview"
            })
        }

        const  totalQuestions= interview.questions?.length;

        let totalScore=0;
        let totalConfidence=0;
        let totalCommunication=0;
        let totalCorrectness=0;
        interview.questions.forEach((q)=>{
            totalScore  +=q.score || 0;
            totalConfidence += q.confidence ||0;
            totalCommunication += q.communication || 0;
            totalCorrectness += q.correctness || 0;

        })

        const finalScore=  totalQuestions ? totalScore/totalQuestions:0;

        const  avgConfidence = totalQuestions ? totalConfidence/totalQuestions:0;

        const avgCommunication=totalQuestions ? totalCommunication/totalQuestions:0;

        const avgCorrectness = totalQuestions ? totalCorrectness/totalQuestions:0;

        interview.finalScore= finalScore;
        interview.status= "completed";

         await interview.save();



         return res.status(200).json({
            finalScore:Number(finalScore.toFixed(1)),
            confidence:Number(avgConfidence.toFixed(1)),
            communication:Number(avgCommunication.toFixed(1)),
            correctness:Number(avgCorrectness.toFixed(1)),
            questionWiseScore: interview.questions.map((q)=>({
                question:q.question,
                score:q.score||0,
                confidence:q.confidence||0,
                feedback:q.feedback||0,
                communication:q.communication ||0,
                correctness:q.correctness||0
            }))
         })   
    } catch (error) {
        return res.status(500).json({
            message:` failed to finish interview ${error}`
       
        })
    }
 }

                    // Find the interview id using the isAuth 
 export  const getMyInterviews= async ( req, res)=>{
    try {
        const interview= await Interview.find({userId:req.userId})
            .sort({createdAt: -1})
            .select("role experience mode finalScore status createdAt")
        return res.status(200).json(interview)
    } catch (error) {
        return res.status(500).json({
            message:`failed to find currentUser interview ${error}`
       
        })
        
    }

 } 
// give the report of the interview 
 export const getInterviewReport= async ( req, res)=>{
    try {
        const interview = await Interview.findById(req.params.id);
        if(!interview){
            return res.status(400).json(
                {
                    message:"Interview Report not found  "
                }
            )
        }

        const  totalQuestions= interview.questions?.length;

        
        let totalConfidence=0;
        let totalCommunication=0;
        let totalCorrectness=0;
        interview.questions.forEach((q)=>{
            
            totalConfidence += q.confidence ||0;
            totalCommunication += q.communication || 0;
            totalCorrectness += q.correctness || 0;

        })

        

        const  avgConfidence = totalQuestions ? totalConfidence/totalQuestions:0;

        const avgCommunication=totalQuestions ? totalCommunication/totalQuestions:0;

        const avgCorrectness = totalQuestions ? totalCorrectness/totalQuestions:0;

        return res.json({
            finalScore:interview.finalScore,
            confidence:Number(avgConfidence.toFixed(1)),
            communication:Number(avgCommunication.toFixed(1)),
            correctness:Number(avgCorrectness.toFixed(1)),
            questionWiseScore: interview.questions
        })

    } catch (error) {
        console.log("Interview  getInteviewReport is not working   ")
        return res.status(500).json({
            message:`failed to find current  interview report  ${error}`
       
        })    
    }
 }