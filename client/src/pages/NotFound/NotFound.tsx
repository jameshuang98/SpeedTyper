import React from 'react'
import { Link } from 'react-router-dom'
import classes from './NotFound.module.scss';

export default function NotFound() {
    return (
        <div className={classes.container}>
            <p>404 Not Found</p>

            <Link to="/">Home</Link>
        </div>

    )
}