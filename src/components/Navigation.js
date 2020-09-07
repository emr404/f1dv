import React from 'react'
import { Link } from "react-router-dom";
import "../scss/style.scss";
const Navigation = () => {
        return (
        <div className='NavBarContainer'>
                <ul className='NavBar'>

                
                <Link className='NavLink'  to='/'> 
                        <li>Home</li>
                </Link>
                
                <Link className='NavLink'  to='/Standings'> 
                        <li>Standings</li>
                </Link>
                
                <Link className='NavLink'  to='/Schedule'> 
                        <li>Schedule</li>
                </Link>

                <Link className='NavLink'  to='/Result'> 
                        <li>Results</li>
                </Link>
                
                <Link className='NavLink'  to='/Drivers'> 
                        <li>Drivers</li>
                </Link>

                </ul>
        </div>
        )
}

export default Navigation
