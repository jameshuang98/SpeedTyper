import React, { useCallback, useState } from 'react';
import { Button, ButtonGroup, CircularProgress } from '@mui/material';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import ResultCard from 'components/ResultCard/ResultCard';
import useService from 'hooks/useService';
import { getUserScores } from 'api/scores';
import { SortOption, ScoreItem } from 'constants/types.js';
import { useAuth } from 'contexts/AuthContext';
import { sortResults } from 'helpers';

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

export default function ScoreHistory() {
    const { user, userLoading } = useAuth();
    const id = user ? user.id : 0;
    const fetchScores = useCallback(() => {
        if (!userLoading) {
            return getUserScores(id);
        }
        return Promise.resolve(null);
    }, [id, userLoading]);
    const { loading, error, response } = useService(fetchScores);
    const data = response?.data;
    const [sortOption, setSortOption] = useState<SortOption>("recent");
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
        if (loading || userLoading) {
            return <CircularProgress />;
        } else if (error) {
            return <div className={classes.error}>{id ? "Error getting data!" : "Must be logged in to get scores!"}</div>;
        } else if (resultCards.length > 0) {
            return (
                <div className={classes.container}>
                    <h3 className={classes.title}>Your Scores</h3>
                    <ButtonGroup size="small" aria-label="Button group for score sorting" className={classes.buttonGroup}>
                        <Button variant={sortOption === "recent" ? "contained" : "outlined"} onClick={() => setSortOption("recent")}>Most Recent</Button>
                        <Button variant={sortOption === "highest" ? "contained" : "outlined"} onClick={() => setSortOption("highest")}>Highest</Button>
                    </ButtonGroup>
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
                </div>
            );
        }
        return null;
    };

    return (
        <>
            {renderContent()}
        </>
    )
}