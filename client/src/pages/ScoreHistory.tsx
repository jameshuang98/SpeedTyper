import React, { useState } from 'react'
import { Button, Typography } from '@mui/material'
import axios from 'axios';
import API_BASE_URL from "../constants/constants.js";


type Props = {};

export default function ScoreHistory() {
    const [data, setData] = useState({email: ""});
    console.log('process', process.env)
    const getData = () => {
        axios.get(`${API_BASE_URL}user/1`)
            .then(response => {
                console.log("response", response);
                setData(response.data);
            })
            .catch(error => {
                // Handle error
            });
    }

    return (
        <>
            <h3>Scores</h3>
            <Button variant="contained" size="large" onClick={getData}>
                <Typography variant="subtitle2">Get Data</Typography>
            </Button>

            <Typography>{data.email ?? ""}</Typography>
        </>
    )
}