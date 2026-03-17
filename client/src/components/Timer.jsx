import React from 'react';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
const Timer= ({timeLeft , totalTime})=>{
    const percentage= (timeLeft/ totalTime)*100;
    return (
        <div className='w-20 h-20'>
            <CircularProgressbar
            value={percentage} 
            text={`${timeLeft}`}
            styles={buildStyles({
                textColor:"pink",
                textSize:"28px",
                pathColor:"pink",
                trailColor:"gray"

            })}
             />
        </div>

    )
}

export default Timer;