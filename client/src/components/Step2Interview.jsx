import React, { useEffect, useRef, useState } from "react";
import  maleVideo from '../assets/Videos/male-ai.mp4'
import  femaleVideo from '../assets/Videos/female-ai.mp4'
import Timer from "./Timer";
import { motion } from "motion/react";
import { FaMicrophoneAlt } from "react-icons/fa";
import { FaMicrophoneSlash } from "react-icons/fa";
import  axios from 'axios';
import { ServerUrl } from "../App";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

const Step2Interview = ({interviewData , onFinish})=>{


    const {interviewId ,  questions, userName}= interviewData;
    if (!interviewData) {
        return <div className="min-h-screen flex items-center justify-center">Loading interview data...</div>;
    }
    const[isIntoPhase , setIsIntoPhase] = useState(true);
    const[isMicOn , setIsMicOn] = useState(true);
    const recognitionRef = useRef(null);
    const[isAIPlaying , setIsAIPlaying] = useState(false);

    const[currentIndex, setCurrentIndex] = useState(0);
    const[answer, setAnswer] = useState("");
    const[feedback, setFeedback] = useState("");
    const [timeLeft, setTimeLeft] = useState(
        questions && questions.length > 0 ? questions[0]?.timeLimits || 60 : 60
    );
    const[selectedVoice, setSelectedVoice]=useState(null);
    const[isSubmitting, setIsSubmitting]=useState(false); // loader   
    const[voiceGender, setVoiceGender]=useState("female");
    const[subtitle, setSubtitle]=useState("");
    
    const videoRef= useRef(null);

    
    // console.log(questions);
    if (!questions || questions.length === 0) {
        return <div className="min-h-screen flex items-center justify-center">Loading questions...</div>;
    };
    const currentQuestion= questions?.[currentIndex]

    useEffect(()=>{
        const loadVoices= ()=>{
            const voice= window.speechSynthesis.getVoices();

            if(!voice.length){ return};

            // try known female voice

            const femaleVoice=
             voice.find(v=>
                v.name.toLowerCase().includes("zira")||
                v.name.toLowerCase().includes("samnatha")||
                v.name.toLowerCase().includes("female")
            );

            if(!femaleVoice){
                setSelectedVoice(femaleVideo);
                setVoiceGender("female");
                return;
            }
             const maleVoice=
             voice.find(v=>
                v.name.toLowerCase().includes("david")||
                v.name.toLowerCase().includes("Mohar Singh Yadav ")||
                v.name.toLowerCase().includes("male")

            );
            if(!maleVoice){
                setSelectedVoice(maleVideo);
                setVoiceGender("male");
                return;
            }
            // Fallback :first voice(assume female)

            setSelectedVoice(voice[0]);
            setVoiceGender("female");
            
                

        }

        loadVoices();

        window.speechSynthesis.onvoiceschanged= loadVoices;


        },[])
    const videoSource= voiceGender==="male" ?maleVideo: femaleVideo;

            //  Speak Function

    const speakText= (text)=>{
         return new Promise((resolve)=>{
           if(!window.speechSynthesis || !selectedVoice){
                resolve();
                return;

            } 
        
            window.speechSynthesis.cancel();
             // add natural pauses after commas and periods
            const humanText= text   
                .replace(/,/g,", ... ")
                .replace(/\,/g,". ... ")
            
            const utterance = new SpeechSynthesisUtterance(humanText);

            utterance.voice= selectedVoice;

            // human Like pacing 
            utterance.rate= 0.92;   //  slightly slower than normal
            utterance.pitch= 1.05;      // small warmth
            utterance.volume=1;

            utterance.onStart = ()=>{  // AI bolna start karega 
                setIsAIPlaying(true);
                stopMic()
                // start the video
                videoRef.current?.play();
            }
            utterance.onend= ()=>{
                videoRef.current.pause();
                videoRef.current.currentTime=0;
                setIsAIPlaying(false)

                if(isMicOn){
                    startMic();
                }

                setTimeout(()=>{
                setSubtitle("");
                resolve()
                },300);
            }

            setSubtitle(text);
            window.speechSynthesis.speak(utterance);
        })

    }

    useEffect(()=>{
        if(!selectedVoice){
            console.log("selected voice  is not working ")
            return
        }
        const runIntro= async()=>{
            if(isIntoPhase){
                await speakText(
                    `Hii ${userName} , it's great to meet you today . I hope you're feeling confident and ready`
                )
                await speakText(
                    "I'll ask you a few question. just answer naturally , and take your time . Let's begin."
                )

                setIsIntoPhase(false);
            }else if(currentQuestion){
                await new Promise(r=>setTimeout(r, 800));

                // if last question (hard level)

                if(currentIndex=== questions.length-1){
                    await speakText("Alright , this one might be a bit more challenging.")
                }
                await speakText(currentQuestion.question);

                if(isMicOn){
                    startMic();
                }
            }
            
        }

        runIntro()


    },[selectedVoice, isIntoPhase , currentIndex])


    useEffect(()=>{
        if (isIntoPhase) {return};
        if (!currentQuestion) {
            console.log("current question is not provided")
            return   
        }
       
        const timer= setInterval(()=>{
            setTimeLeft((prev)=>{
                if (prev<=1) {
                    clearInterval(timer)
                    return 0;

                }
                return prev-1;
            })
        }, 1000)
        return ()=>clearInterval(timer);

    },[isIntoPhase, currentQuestion ])
    useEffect(()=>{
        if (!isIntoPhase && currentQuestion) {
            setTimeLeft(currentQuestion.timeLimits || 60)
        }
    },[currentIndex])

    
    // voice to text convert

    useEffect(()=>{
        if (!("webkitSpeechRecognition" in window)) {
            console.log("webkitSpeechRecognition is not found ")
            return
        }
        const recognition= new window.webkitSpeechRecognition();
        recognition.lang= "en-US";
        recognition.continuous=true;
        recognition.interimResults= true;

        recognition.onresult= (event)=>{
            const lastResult = event.results[event.results.length-1];
            if (lastResult.isFinal) {
                const transcript = lastResult[0].transcript;
                setAnswer((prev)=> prev + " " + transcript.trim())
            }
        }
        recognitionRef.current= recognition;
    },[])

    const startMic= ()=>{
        if (recognitionRef.current && !isAIPlaying ) {
            try {
                 recognitionRef.current.start();
            } catch (error) {
                
            }
           
        }
    }
    const stopMic= ()=>{
        if(recognitionRef.current){
            recognitionRef.current.stop(); 
        }
    }

    const toggleMic= ()=>{
        if(isMicOn){
            stopMic();
        }else{
            startMic();
        }
        setIsMicOn(!isMicOn);
    }

    const submitAnswer= async ()=>{
        if(isSubmitting){return};
        stopMic();
        setIsSubmitting(true);
        try {
            const result= await axios.post(ServerUrl + '/api/interview/submit-answer' ,{
                interviewId,
                questionIndex:currentIndex,
                answer,
                timeTaken:currentQuestion.timeLimits-timeLeft,
            }, {withCredentials:true})
            console.log(result);
            setFeedback(result.data.feedback);
            speakText(result.data.feedback);
            setIsSubmitting(false);

        } catch (error) {
            console.log("Answer is not submitting  " , error)
            setIsSubmitting(false);
        }            
    }

    const handleNext= async ()=>{
        setAnswer("");
        setFeedback("");

        if(currentIndex +1>= questions.length){
            finalInterview();
            return;

        }
        await speakText(" Alright , let's move to the next question.");
        setCurrentIndex(currentIndex+1);
        setTimeout(()=>{
            if(isMicOn){startMic()}
        } , 500);
       
    }

    const finalInterview= async ()=>{
        stopMic();
        setIsMicOn(false);        
        try {
            const result = await axios.post(ServerUrl + '/api/interview/finish' , {interviewId} , {withCredentials:true})
            console.log(result.data);
            onFinish(result.data);

        } catch (error) {
            console.log("finalInterview method is not working " , error);

        }
    }

    useEffect(()=>{
        if(isIntoPhase)return;
        if(!currentQuestion) return;
        if(timeLeft==0 && !isSubmitting && !feedback){
            submitAnswer();
        }
    }, [timeLeft]);

    useEffect(()=>{
        return ()=>{
            if(recognitionRef.current){
                recognitionRef.current.stop();
                recognitionRef.current.abort();
            }
            window.speechSynthesis.cancel();
        }
    },[])



    return(
        <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-pink-100 
        flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-350 min-h-[80vh] bg-white rounded-3xl 
            shadow-2xl border border-red-200 flex flex-col lg:flex-row overflow-hidden">
                {/* video section */}
                <div className="w-full lg:w-[35%] bg-white flex flex-col items-center 
                    p-6 space-y-6 border-r border-pink-200">
                    <div className="w-full max-w-md rounded-2xl overflow-hidden">
                        <video
                         src={videoSource}
                         key={videoSource}
                         ref={videoRef}
                         muted
                         playsInline
                         preload="auto"
                         className="w-full h-auto object-cover"
                         />
                    </div>

                    {/* subtitle Pending */}
                    {subtitle && (
                        <div className="w-full max-w-md bg-white border-pink-200 rounded-2xl shadow-md
                        p-4 space-y-5">
                            <p className="text-pink-700 text-sm sm:text-base font-medium
                            text-center leading-relaxed">{subtitle}</p>
                        </div>
                    )}

                    {/* Timer Area */}
                    <div className="w-full max-w-md  bg-white rounded-2xl 
                    shadow-md border border-red-200 p-6 space-y-5"
                    >
                       <div className="flex  justify-between items-center">
                        <span className="text-sm text-gray-600">Interview Status</span>
                        {isAIPlaying &&  <span className="text-sm font-semibold text-red-600">
                            { isAIPlaying ?"AI Speaking" :""}
                        </span>}
                        </div> 
                        <div className="h-px bg-gray-200"></div>
                        <div className="flex justify-center">
                            <Timer timeLeft={timeLeft}totalTime={currentQuestion?.timeLimits || 60}/>
                        </div>

                        {/* gray line  */}
                        <div className="h-px bg-gray-200"></div>
                        <div className="grid grid-cols gap-6 text-center">
                            <div>
                                <span className="text-2xl font-bold text-pink-600"> {currentIndex +1}</span>
                                <span className="text-xs text-gray-400">Current Question</span>
                            </div>
                            <div>
                                <span className="text-2xl font-bold text-pink-600"> {questions.length}</span>
                                <span className="text-xs text-gray-400">Total Question</span>
                            </div>

                        </div>


                        
                    </div>

                </div>

                {/* Text Section */}
                 <div className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative">
                    <h2 className="text-xl sm:text-2xl font-bold text-pink-600 mb-6">
                        AI Smart Interview
                    </h2>

                    { !isIntoPhase &&
                        <div className="relative mb-6 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-pink-200 shadow-sm">
                        <p className="text-xs sm:text-sm text-gray-400 mb-2">
                            {currentIndex +1} of {questions.length}
                        </p>
                        <div className="text-base sm:text-lg font-semibold text-gray-800 leading-relaxed">
                           {currentQuestion?.question}
                        </div>
                        </div>

                        
                    }
                        <textarea 
                        placeholder="Type your answer here...."
                        onChange={(e)=>setAnswer(e.target.value)}
                        value={answer}
                        className="flex-1 bg-gray-100 p-4 sm:p-6 rounded-2xl resize-none
                        outline-none border border-gray-200 focus:ring-2
                        focus:ring-pink-500 transition text-gray-800"
                        />

                    { !feedback ?  (< div className="flex items-center gap-4 mt-6">
                            <motion.button
                            onClick={toggleMic}
                            whileTap={{scale:0.9}}
                            className="w-12 h-12 sm:w-14 sm:h-14 flex
                            items-center justify-center rounded-full bg-black text-white shadow-lg"
                            >
                            {isMicOn?<FaMicrophoneAlt size={20}/> :<FaMicrophoneSlash size={20}/>}
                            </motion.button>
                            <motion.button
                             whileTap={{opacity:0.95}}
                             onClick={submitAnswer}
                             disabled={isSubmitting}
                             className="flex-1 bg-gradient-to-r from-pink-600 to-red-500 
                             text-white py-3 sm:py-4 rounded-2xl shadow-lg 
                             hover:opacity-90 transition font-semibold disabled:bg-red-500"
                             >
                                {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                            </motion.button>

                        </div>):(
                           <motion.div 
                           initial={{opacity:0}}
                           animate={{opacity:1}}
                           className="mt-6 bg-pink-50 border 
                           border-red-200 p-5 rounded-2xl shadow-sm">
                                <p className="text-red-700 font-medium mb-"> {feedback} </p>
                                <button onClick={handleNext} className="w-full bg-gradient-to-r from-pink-600 to-teal-500
                                text-white py-3 rounded-xl shadow-md hover:opacity-90 transition flex items-center justify-center gap-1">
                                    Next Question <BsArrowRight size={18}/>

                                </button>
                            </motion.div>

                        )}
                    </div>

                    {/* {feedback && (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                            <p className="text-sm text-blue-800">{feedback}</p>
                        </div>
                    )} */}

                 </div>
            </div>

        // </div>
    )
}
export default Step2Interview;