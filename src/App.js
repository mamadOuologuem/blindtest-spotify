/*global swal*/

import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import loading from './loading.svg';
import './App.css';
import Sound from 'react-sound';
import Button from './Button';
import AlbumCover from './AlbumCover';

const apiToken =
	'BQC8gLRmvy0C1PI5JQ-Y2373_-iD-YQytOk60NCa8yisIjN02uHc6GU2CiVrC9xD0a58neroSJyh2np1gZB9FWSzybSwEuaSbfY_dRzwb0tfyRn1L61kv1iKH1DQ8kPpXwj5-XpzMZdEcCeGLMN_nsREryiS';

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
	const [currentTrack, setCurrentTrack] = useState();
	const [songsLoaded, setSongsLoaded] = useState(false);
	const [total, setTotal] = useState(0);
	const [tracks, setTracks] = useState([]);

	const track1 = tracks[0]?.track;
	const track2 = tracks[3]?.track;
	const track3 = tracks[8]?.track;

	console.log('tracks', tracks);
	// console.log(
	// 	'tracks',
	// 	tracks.map(({ track: { name, preview_url } }) => ({ name, preview_url }))
	// );

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
				setCurrentTrack(data.items[0].track);
			});
	}, []);

	const checkAnswer = (responseTrackId) => {
		if (responseTrackId === currentTrack.id) {
			swal('Bravo 🎉', 'Bosh Like a Boss', 'success');
		} else {
			swal('Mauvaise pioche 😜', 'Essaye encore', 'error');
		}
	};

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
				<p>Votre premiere chanson ♥️: {track1.name} </p>
				<AlbumCover track={track1} />
				<Sound url={track1.preview_url} playStatus={Sound.status.PLAYING} />
			</div>
			<div className='App-buttons'>
				<Button onClick={() => checkAnswer(track1.id)}>{track1.name}</Button>
				<Button onClick={() => checkAnswer(track2.id)}>{track2.name}</Button>
				<Button onClick={() => checkAnswer(track3.id)}>{track3.name}</Button>
			</div>
		</div>
	);
};

export default App;
