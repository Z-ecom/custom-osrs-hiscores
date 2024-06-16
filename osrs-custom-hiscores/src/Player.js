import React from 'react';

const Player = ({ rank, player }) => {
    return (
        <li>
            <span>Rank {rank}</span>
            <span>{player.username}</span>
            <span>Level {player.level}</span>
            <span>XP {player.xp}</span>
        </li>
    );
};

export default Player;