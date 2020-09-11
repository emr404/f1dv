import React from 'react'
import { useState, useEffect } from "react";
import { Bar, Line, Radar } from "react-chartjs-2";
import StandingList from "./StandingsComponent";
import  "../scss/style.scss";

const Standings = () => {
        const [chartData, setChartData] = useState([]);
        const [raceSet, setRaceSet] = useState([]);
        const [year, setYear] = useState(2020);
        const [raceEvent, setRaceEvent] = useState([]);
        const [seasonList, setSeasonList] = useState([]);
        
        
        const chart = ()=>{
        const chartLabel = raceEvent.map(driver => driver.name);
        const chartDigits = raceEvent.map(driver => driver.points);
        
        setChartData({
        labels: chartLabel,
        datasets:[{
        label:'Points',
        data: chartDigits,
        backgroundColor:'red',
        borderColor:'black',
        borderWidth:'0',
        fill: false,
        fontColor: 'black',
        }]
        ,
        borderWidth:'20'
    })
}
    useEffect(() => {
        chart();
    }, [raceEvent])
        
    
    useEffect(() => {
            const seasonArray = [];
            fetch("https://ergast.com/api/f1/seasons.json?limit=100&offset=0")
            .then((response) => response.json())
            .then((data) => {
                const realInfo = data.MRData.SeasonTable.Seasons;
                realInfo.map((seasons) => {
                const { season } = seasons;
                seasonArray.push(season)
                
                });
            });

            setSeasonList(seasonArray);
    }, [])
    

        useEffect(() => {
            let ok = [];
            fetch(`https://ergast.com/api/f1/${year}/driverStandings.json`)
                .then((response) => response.json())
                .then((data) => {
                const moreData = data.MRData.StandingsTable.StandingsLists;
                moreData.forEach((race) => {
                    race.DriverStandings.map((driver) => {
                    const {Driver: { permanentNumber, givenName, driverId,nationality, familyName },position,points,Constructors:[{name}]} = driver;
                    ok.push({ name: familyName, fname:givenName, points: points,position:position, nationality:nationality, car: name, number:permanentNumber });
                    });
                });
                setRaceEvent(ok);
                });
                
            }, [year]);

            const handleChange = e=>{
                setYear(e.target.value);
            }
    return (
        <div className='StandingsContainer' >
                <h1>Standings</h1>
                <div className='Season'>
                <h2>Season: <span style={{fontWeight:'bolder'}}>{year}</span></h2>
                
                <label htmlFor="SelectYear">Select Year:  
                <select value={year} onChange={handleChange} >
                    <option value="">2020</option>
                        {seasonList.map(season=>(<option key={season} value={season}>{season}</option>))}
                </select>
                </label>
            </div>

            {chartData == ''? (
                <div style={{marginTop:'20vh'}} className="Loader">
                <span className='LoaderSpan'>|</span>
                <span className='LoaderSpan' style={{ "--delay": "0.1s" }}>|</span>
                <span className='LoaderSpan' style={{ "--delay": "0.3s" }}>|</span>
                <span className='LoaderSpan' style={{ "--delay": "0.4s" }}>|</span>
                <span className='LoaderSpan' style={{ "--delay": "0.5s" }}>|</span>
                </div>
                
            ):

            <div>
                <Line  data={chartData}/>
            
            <div className='DriversListHeading'>
                <ul>
                    <li>
                        <h3 style={{minWidth:'3vw'}} >Pos.</h3>
                        <h3>Driver</h3>
                        <h3>Constructor </h3>
                        <h3 style={{minWidth:'3vw'}}>No.</h3>
                        <h3>Points</h3>
                    </li>
                </ul>
            </div>
            {raceEvent.map(race => 
                <StandingList key={race.position} {...race}/>
            )}
            
            </div>
            }


        </div>
    )
}

export default Standings
