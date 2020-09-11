import React from 'react'
import {useState,useEffect} from 'react'
import "../scss/style.scss";
const Schedule = () => {
    const [schedule, setSchedule] = useState([])
    const [season, setSeason] = useState([])
    useEffect(() => {
            fetch(`https://ergast.com/api/f1/current.json`)
            .then(response=> response.json())
            .then(data=>{
                let scheduleArray= []
                const year = data.MRData.RaceTable.season;
                setSeason(year)
                const schedules = data.MRData.RaceTable.Races;
                schedules.map(schedule=>{
                const {date,raceName,time,round,Circuit:{circuitName,Location:{country,locality}}} = schedule
                /* console.log(date,raceName,time,round,circuitName,country,locality); */
                scheduleArray.push({date:date,race:raceName,time:time,round:round,circuit:circuitName,country:country,city:locality})
                })

                setSchedule(scheduleArray)
            })
        }, [])
    return (
        <div className='ScheduleContainer'>
            <h1>Schedule</h1>
            {/* <h2 className='seasonTitle'>Season: {season}</h2> */}
            <div className='ScheduleHeading'>
                <ul>
                    <li>
                        <h3 style={{minWidth:'2vw'}}> Round </h3>
                        <h3 style={{minWidth:'2vw'}}> Date/Time</h3>
                        <h3 style={{minWidth:'12vw'}}>  Event </h3>
                        <h3> Location </h3> 
                    </li>
                </ul>
            </div>
                {schedule == ''? (
                <div style={{marginTop:'20vh'}} className="Loader">
                <span className='LoaderSpan'>|</span>
                <span className='LoaderSpan' style={{ "--delay": "0.1s" }}>|</span>
                <span className='LoaderSpan' style={{ "--delay": "0.3s" }}>|</span>
                <span className='LoaderSpan' style={{ "--delay": "0.4s" }}>|</span>
                <span className='LoaderSpan' style={{ "--delay": "0.5s" }}>|</span>
                </div>
                
            ):
            <div>
                
                {schedule.slice(9,18).map(schedule=>(
                    <div className='ScheduleListContainer' key={schedule.date}>
                    <li>
                            <h3 style={{minWidth:'2vw'}}>{schedule.round}</h3>
                            <h3 style={{minWidth:'2vw'}}>{schedule.date} <br/> <br/> {schedule.time}</h3>
                            <h3 style={{minWidth:'10vw'}}>{schedule.race}</h3>
                            <h3>{schedule.city},{schedule.country}</h3>
                        
                    </li>
                    </div>
                ))}
            </div>
                }
        </div>
    )
}

export default Schedule
