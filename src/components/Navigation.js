import React from 'react'
import { Link } from "react-router-dom";
import "../scss/style.scss";
const Navigation = () => {
        const burger = document.querySelector('.Burger');
        const nav = document.querySelector('.NavBar');
        const handleClick = () => {
                nav.classList.toggle('Active');
                burger.classList.toggle('Toggle');
                /* console.log(burger.className); */
        }
        return (
        <div className='NavBarContainer'>
                <img className='LargeImg' src="https://upload.wikimedia.org/wikipedia/commons/3/33/F1.svg" alt=""/> 
                <div className='NavHeader'>
                <div className = 'Burger' onClick = {handleClick}>
                        <div className="Line1"></div>
                        <div className="Line2"></div>
                        <div className="Line3"></div>
                </div>
                        <img className='SmallImg'  src="https://upload.wikimedia.org/wikipedia/commons/3/33/F1.svg" alt=""/> 
                        
                </div>
                <ul className='NavBar'>

                <Link className='NavLink'  to='/'> 
                        <li>Results</li>
                </Link>
                
                <Link className='NavLink'  to='/Standings'> 
                        <li>Standings</li>
                </Link>
                
                <Link className='NavLink'  to='/Schedule'> 
                        <li>Schedule</li>
                </Link>

                
                
                <Link className='NavLink'  to='/Drivers'> 
                        <li>Drivers</li>
                </Link>

                </ul>
        </div>
        )
}

export default Navigation
