import React from 'react'
import {useState,useEffect} from 'react'

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
        <div className='ScoreboardContainer'>
            <h1>Schedule</h1>
            <h2 className='seasonTitle'>Season: {season}</h2>

            {   
                schedule.slice(9,18).map(schedule=>(
                    <div className='scheduleListContainer' key={schedule.date}>
                    <li>
                        <div className='scheduleList'>
                            <span className='date'>{schedule.date} <br/> <br/> {schedule.time} </span>
                            <span className='race'>{schedule.race}</span>
                            <span className='ScheduleDetail'>{schedule.round}</span>
                            <span className='ScheduleDetail'>{schedule.city},{schedule.country}</span>
                        </div>
                    </li>
                    </div>
                ))}
        </div>
    )
}

export default Schedule
