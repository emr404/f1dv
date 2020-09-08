import React from 'react'
import { useState,useEffect } from "react";
import ReactAutocomplete  from "react-autocomplete";
import { Bar } from "react-chartjs-2";
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
            const newData = data.MRData.RaceTable.Races;
            newData.map(a=>{
                console.log(a);
                const {season,raceName,Results:[{position,points,Constructor:{name},Driver:{familyName,givenName,driverId}}]} = a
                activeDriverArray.push({race: raceName,points:points, position: position,season: season,car: name,fname: givenName,lname: familyName})
            })  
            setActiveDriver(activeDriverArray)
        })

    }, [year,state])


        useEffect(() => {
        const ok = [];
        fetch("https://ergast.com/api/f1/seasons.json?limit=100&offset=0")
            .then((response) => response.json())
            .then((data) => {
                const realInfo = data.MRData.SeasonTable.Seasons;
                realInfo.map((seasons) => {
                    const {season} = seasons;
                    ok.push(season)
                });
            });
        setSeasons(ok);
    }, [])
    useEffect(() => {
        fetch(`http://ergast.com/api/f1/drivers.json?limit=848&offset=0`)
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
        <div>
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

            <select value={year} onChange={handleChange} >
                <option value="">Select Year</option>
                {seasons.map(season=> <option value={season} key={season}>{season}</option>)}
            </select>

            <button onClick={handleClick}>Confirm</button>

            <Bar className='Chart' data={chartData}/>
        </div>
    )
}

export default Drivers
