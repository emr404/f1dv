import React from 'react'

const DriverComponent = ({race,points,position}) => {
    return (
        <div>
            <div className='DriversList'>
                <ul>
                    <li>
                        <h3>{position}</h3>
                        <h3>{race}</h3>
                        <h3>{points}</h3>
                    </li>
                </ul>

            </div>
        </div>
    )
}

export default DriverComponent
