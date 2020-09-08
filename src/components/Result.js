import React from 'react'
import {useEffect,useState} from 'react';
import { Line } from "react-chartjs-2";
import ResultComponent from "./ResultComponent";


const Result = () => {
    const [results, setResults] = useState([])
    const [drivers, setDrivers] = useState([])
    const [chartData, setChartData] = useState([])

    const [year, setYear] = useState(2020)
    const [seasonList, setSeasonList] = useState([])
    const [round, setRound] = useState('last')
    const [title, setTitle] = useState([])
    
    useEffect(() => {
        fetch(`https://ergast.com/api/f1/${year}/${round}/results.json`)
        .then(response=> response.json())
        .then(data =>{
            const resultsArray = [];
            const driverArray = [];
            const raceTitleArray=[];
            
            const raceData = data.MRData.RaceTable.Races;
            raceData.map(race => {
                
                    const {raceName,date,season,round,Results,Circuit: {url,circuitName,Location: {locality,country}}} = race;
                    /* console.log(raceName, date, season, 'Round ' + round); */
                    raceTitleArray.push({race:raceName,date: date,season:season,round: round})
                    Results.map(res => {
                    const {Constructor:{name},position,points,Driver: {familyName,givenName,permanentNumber}} = res
                        resultsArray.push({position:position,num:permanentNumber,car:name,  points:points,name:givenName,surname:familyName})
                        driverArray.push({points:points, surname: familyName})
                        /* console.log(position, permanentNumber, familyName, points, name); */
                        })
                        setResults(resultsArray);
                        setDrivers(driverArray);
                        setTitle(raceTitleArray)
                })
        })
    }, [year,round])
        const handleClick = e =>{
        setRound(e.target.value)
    }
    const handleChange = e => {
        setYear(e.target.value);
    }
useEffect(() => {
    const seasonListArray = [];
    fetch("https://ergast.com/api/f1/seasons.json?limit=100&offset=0")
        .then((response) => response.json())
        .then((data) => {
            const seasonList = data.MRData.SeasonTable.Seasons;
            seasonList.map((seasons) => {
                const {season} = seasons;
                seasonListArray.push(season)

            });

            setSeasonList(seasonListArray);
        });

    
}, [])
const handleSubmit = e => {
    const driverName = drivers.map(driver => driver.surname)
    const driverPoints = drivers.map(driver => driver.points)
    setChartData({
        labels: driverName,
        datasets: [{
            label: 'Points',
            data: driverPoints,
            backgroundColor: 'red',
            borderColor: 'black',
            borderWidth: '0',
            fill: false,
            fontColor: 'black',

        }]

    })
}
    
    
    return (
        <div className='ResultContainer'>
            <h1>Result</h1>
            <div className='ResultSearch'>
            
            <label htmlFor="Season"> Select Season: 
            <select value={year} onChange={handleChange} >
                <option value="">2020</option>
                {seasonList.map(season=>(<option key={season} value={season}>{season}</option>))}
            </select>
            </label>
            
            <label htmlFor="Round"> Select Round: 
                <input type="number" min='1' onChange={handleClick} max='21'  placeholder='Enter Round' />
            </label>
            <button onClick={handleSubmit}>Confirm</button>
            </div>


            {title.map(race=>(
                <h2 className='RaceName' key={race.round}>{race.race} <br/> <span className='Round'>Round: {race.round} </span> </h2> 
            ))}

            <Line data={chartData} />

            <div className='DriversListHeading'>
                        <ul>
                            <li>
                                <h3 style={{minWidth:'3vw'}} >Pos.</h3>
                                <h3>Driver</h3>
                                <h3>Constructor</h3>
                                <h3 style={{minWidth:'3vw'}}>No.</h3>
                                <h3>Points</h3>
                            </li>
                        </ul>
            </div>


            {results.map(result=>(
                        <ResultComponent key={result.position} {...result}/>
            ))}

        </div>
    )
}

export default Result
