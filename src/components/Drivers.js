import React from 'react'
import { useState,useEffect } from "react";
import ReactAutocomplete  from "react-autocomplete";
import { Bar } from "react-chartjs-2";
import DriverComponent from "./DriverComponent";
import Autocomplete from "./Autocomplete";
const Drivers = () => {
    const [state, setState] = useState();
    const [drivers, setDrivers] = useState([]);
    const [activeDriver, setActiveDriver] = useState(['hamilton']);
    const [seasons, setSeasons] = useState([]);
    const [year, setYear] = useState(2020);
    const [chartData, setChartData] = useState([])
        
    useEffect(() => {
        const activeDriverArray = [];
        fetch(`https://ergast.com/api/f1/${year}/drivers/${state}/results.json`)
        .then(response=> response.json())
        .then(data=>{
            const raceData = data.MRData.RaceTable.Races;
            raceData.map(races => {
                console.log(races);
                const {season,raceName,Results:[{position,points,Constructor:{name},Driver:{familyName,givenName,driverId}}]} = races
                
                
                activeDriverArray.push({race: raceName,points:points, position: position,season: season,car: name,fname: givenName,lname: familyName})
            })  
            setActiveDriver(activeDriverArray)
        })

    }, [year,state])


        useEffect(() => {
        const seasonArray = [];
        fetch("https://ergast.com/api/f1/seasons.json?limit=100&offset=0")
            .then((response) => response.json())
            .then((data) => {
                const Seasons = data.MRData.SeasonTable.Seasons;
                Seasons.map((seasons) => {
                    const {season} = seasons;
                    seasonArray.push(season)
                });
            });
        setSeasons(seasonArray);
    }, [])
    useEffect(() => {
        fetch(`https://ergast.com/api/f1/drivers.json?limit=848&offset=0`)
        .then(response=>response.json())
        .then(data=>{
            let driverArray = [];
            const drivers = data.MRData.DriverTable.Drivers
            drivers.map(driver=>{
                const { familyName, givenName, driverId } = driver;
                /* console.log(givenName + ' ' + familyName + ' '+driverId); */
                driverArray.push({label: familyName +' ' + givenName, label:driverId})
                
            })
            setDrivers(driverArray)
        })
    }, [])
    
    const handleChange = e => {
        setYear(e.target.value);
    }
    
    const handleClick = () => {
    const chartDataRace = activeDriver.map(driver => driver.race);
    const chartDataPoints = activeDriver.map(driver => driver.points);

    setChartData({
        labels: chartDataRace,
        datasets: [{
            label: 'Points',
            data: chartDataPoints,
            backgroundColor: 'red',
            borderColor: 'black',
            borderWidth: '0',
            fill: false,
            fontColor: 'black',
        }]
    })
}
    return (
        <div className='DriverContainer'>
            <h1>Drivers</h1>

            <div className='DriverSearch'>
            <label htmlFor="Driver Name">Last Name:
            <ReactAutocomplete  
            items={drivers}
            shouldItemRender={(item, value) =>item.label.toLowerCase().indexOf(value) > -1}
            getItemValue={(item) => item.label}
            renderItem={item => <div key={item.label} >{item.label}</div>}
            value={state}
            onChange={e => setState(e.target.value)}
            onSelect={value => setState(value)}
            
            menuStyle = {
                {
                    borderRadius: '10px',
                    boxShadow: '0 2px 12px rgba(255, 255, 255, 1)',
                    background: 'white',
                    padding: '10px 5px',
                    fontSize: '90%',
                    position: 'fixed',
                    overflow: 'auto',
                    maxHeight: '50%',
                    border:'none',
                    cursor: "pointer",
                    color:'black',
                    textTransform:'uppercase'
                }
            }/>
            </label>

            <label htmlFor="Year"> Select Year
                <select value={year} onChange={handleChange} >
                    <option value="">Year</option>
                    {seasons.map(season=> <option value={season} key={season}>{season}</option>)}
                </select>
            </label>

            <button onClick={handleClick}>Confirm</button>
            </div>

            
            {activeDriver.slice(0,1).map(driver=>(
                <div div className = 'DriverDetails' >
                    <h3>Driver: {driver.fname} {driver.lname}  </h3>
                    <h3>Constructor: {driver.car}</h3>
                    <h3>Season:{driver.season}</h3>
                </div>
                
            ))}
            <Bar className='Chart' data={chartData}/>

            <div className='DriversListHeading'>
                <ul>
                    <li>
                        <h3>Position</h3>
                        <h3>Race</h3>
                        <h3>Points</h3>
                    </li>
                </ul>
            </div>

            {activeDriver.map(driver=>(
                <DriverComponent key ={driver.season} {...driver} />
            ))}

        </div>
    )
}

export default Drivers
