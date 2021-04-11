/*global swal*/

import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import loading from './loading.svg';
import './App.css';
import Sound from 'react-sound';
import Button from './Button';
import AlbumCover from './AlbumCover';

const apiToken =
	'BQDmd1MNNAU7iZfuggmu_XH0EYbGJTR6YhyLpnuX8kI5yDhl66MfEoNaOO1Ecxe8oqy9dqanckbu6fVKak34-mVEnoJuUE0-agzqjkMn4y01TuJQT5R2SuEwq2w2MhIKFDhkoCZsqqXAhzbpt6P5P2FwABLK';

function shuffleArray(array) {
	let counter = array.length;

	while (counter > 0) {
		let index = getRandomNumber(counter);
		counter--;
		let temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}

	return array;
}

/* Return a random number between 0 included and x excluded */
function getRandomNumber(x) {
	return Math.floor(Math.random() * x);
}

const App = () => {
	const [songsLoaded, setSongsLoaded] = useState(false);
	const [total, setTotal] = useState(0);
	const [tracks, setTracks] = useState({});
	console.log('tracks', tracks);

	useEffect(() => {
		fetch('https://api.spotify.com/v1/me/tracks', {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + apiToken,
			},
		})
			.then((response) => response.json())
			.then((data) => {
				setTracks(data.items);
				setTotal(data.total);
				setSongsLoaded(true);
			});
	}, []);

	if (!songsLoaded) {
		return <img src={loading} className='App-logo' alt='loading' />;
	}

	return (
		<div className='App'>
			<header className='App-header'>
				<img src={logo} className='App-logo' alt='logo' />
				<h1 className='App-title'>Nous avons retrouvé {total} musiques!</h1>
			</header>
			<div className='App-images'>
				<p>Votre premiere chanson ♥️: {tracks[0].track.name} </p>
				<AlbumCover track={tracks[0].track} />
			</div>
			<div className='App-buttons'></div>
		</div>
	);
};

export default App;
