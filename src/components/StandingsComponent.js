import React from 'react'
import "../scss/style.scss";
const StandingsComponent = ({position,points,name,fname,car,number}) => {
    return (
        <div>
            <div>
            <div className="DriversList">
            <ul>
                <li>
                <h3 style={{minWidth:'3vw'}} >{position}</h3>
                <h3> <strong> {fname} <br/> {name} </strong></h3>
                <h3>{car}</h3>
                <h3 style={{minWidth:'3vw'}}>{number}</h3>
                <h3>{points}</h3>
                </li>
            </ul>
            </div>
        </div>
        </div>
    )
}

export default StandingsComponent
