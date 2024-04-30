import React, { useState } from 'react';
import axios from 'axios';
import { Button, ButtonGroup, CircularProgress } from '@mui/material';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import ResultCard from 'components/ResultCard/ResultCard';
import useService from 'hooks/useService';
import { SortOption, ScoreItem } from 'constants/types.js';
import API_BASE_URL from '../../constants/constants.js';

import classes from './ScoreHistory.module.scss';

const responsive = {
    ultraWideScreen: {
        // the naming can be any, depends on you.
        breakpoint: { max: 3000, min: 2000 },
        items: 6
    },
    wideScreen: {
        // the naming can be any, depends on you.
        breakpoint: { max: 2000, min: 1200 },
        items: 4
    },
    desktop: {
        breakpoint: { max: 1200, min: 1024 },
        items: 3
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
    }
};


const getScores = async (): Promise<ScoreItem[]> => {
    return axios.get(`${API_BASE_URL}score`)
        .then(response => {
            console.log("response", response);
            return response.data;
        })
        .catch(error => {
            console.log(error)
        });
};

export default function ScoreHistory() {
    const { loading, error, data } = useService(getScores);
    const [sortOption, setSortOption] = useState<SortOption>("recent");
    const sortResults = (option: SortOption) => {
        switch (option) {
            case "recent":
                return ((a: ScoreItem, b: ScoreItem) => {
                    // Compare dates first
                    const dateA = new Date(a.createdDate);
                    const dateB = new Date(b.createdDate);
                    const dateComparison = dateB.toDateString().localeCompare(dateA.toDateString());
                    if (dateComparison !== 0) {
                        // If dates are different, return the result of the date comparison
                        return dateComparison;
                    } else {
                        // If dates are the same, compare times
                        return dateB.getTime() - dateA.getTime();
                    }
                });
            case "highest":
            default:
                return ((a: ScoreItem, b: ScoreItem) => b.correctWords - a.correctWords);
        }
    }

    // filter by recent, top score
    const resultCards = Array.isArray(data) ?
        data.sort(sortResults(sortOption))
            .slice(0, 10) // take the first 10
            .map((s: ScoreItem, i) => (
                <ResultCard
                    key={i}
                    title={(new Date(s.createdDate)).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })}
                    correctWords={s.correctWords}
                    incorrectWords={s.incorrectWords}
                    characters={s.characters}
                    buttons={null}
                />
            )) : [];

    const renderContent = () => {
        if (loading) return <CircularProgress />;
        if (error) return <div>Error getting data!</div>;
        if (resultCards.length > 0) {
            return (
                <Carousel
                    responsive={responsive}
                    swipeable={false}
                    keyBoardControl={true}
                    containerClass={classes.carouselContainer}
                    itemClass={classes.carouselItem}
                    sliderClass={classes.slider}
                    dotListClass={classes.dotList}
                    removeArrowOnDeviceType={["tablet", "mobile"]}
                    showDots={true}
                >
                    {resultCards}
                </Carousel>
            );
        }
        return null;
    };

    return (
        <div className={classes.container}>
            <h3 className={classes.title}>Your Scores</h3>
            <ButtonGroup size="small" aria-label="Button group for score sorting" className={classes.buttonGroup}>
                <Button variant={sortOption === "recent" ? "contained" : "outlined"} onClick={() => setSortOption("recent")}>Most Recent</Button>
                <Button variant={sortOption === "highest" ? "contained" : "outlined"} onClick={() => setSortOption("highest")}>Highest</Button>
            </ButtonGroup>
            {renderContent()}
        </div>
    )
}