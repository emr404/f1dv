import React from 'react'

const ResultComponent = ({num,
position,points, car, surname,name}) => {
    return (
        <div>
            <div className = "DriversList" >
                <ul>
                    <li>
                        <h3 style={{minWidth:'3vw'}} >{position}</h3>
                        <h3> <strong> {name} <br/> {surname} </strong></h3>
                        <h3>{car}</h3>
                        <h3 style={{minWidth:'3vw'}}>{num}</h3>
                        <h3>{points}</h3>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default ResultComponent
