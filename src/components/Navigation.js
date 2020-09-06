import React from 'react'
import { Link } from "react-router-dom";

const Navigation = () => {
        return (
        <div>
                <Link  to='/'> 
                        <li>Home</li>
                </Link>
                
                <Link  to='/Standings'> 
                        <li>Standings</li>
                </Link>
                
                <Link  to='/Schedule'> 
                        <li>Schedule</li>
                </Link>

                <Link  to='/Result'> 
                        <li>Results</li>
                </Link>
                
                <Link  to='/Drivers'> 
                        <li>Drivers</li>
                </Link>
        </div>
        )
}

export default Navigation
