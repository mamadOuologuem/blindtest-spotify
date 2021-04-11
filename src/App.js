/*global swal*/

import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import loading from './loading.svg';
import './App.css';
import Sound from 'react-sound';
import Button from './Button';
import AlbumCover from './AlbumCover';

const apiToken =
	'BQCMxCSV9kF0yotwU3yBkQ40kJTEK98yqdeydeWgO4jwG_ixftK6kKR9LLcxPlmCbXZFNUAdQrWVscx6HYfBjvq9m4OEg1gBLATqWGP8vSxAH_OpH-Czo0WG_RWq3rhJWx1-ZPZ_S9vPxzTI0W3qjuOt-QXM';

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
	let timer = null;

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
				setCurrentTrack(data.items[getRandomNumber(data.items.length)].track);
				setSongsLoaded(true);
			});
	}, []);

	useEffect(() => {
		timer = setTimeout(() => selectNewTrackToGuess(), 30000);
	}, [currentTrack, timer]);

	const selectNewTrackToGuess = () => {
		if (tracks.length) {
			setCurrentTrack(tracks[getRandomNumber(tracks.length)].track);
		}
	};

	const checkAnswer = (responseTrackId) => {
		if (responseTrackId === currentTrack.id) {
			clearTimeout(timer);
			swal('Bravo 🎉', 'Bosh Like a Boss', 'success').then(
				selectNewTrackToGuess
			);
		} else {
			swal('Mauvaise pioche 😜', 'Essaye encore', 'error');
		}
	};

	if (!songsLoaded) {
		return <img src={loading} className='App-logo' alt='loading' />;
	}

	const displayedTracks = shuffleArray([
		currentTrack,
		tracks[getRandomNumber(tracks.length)].track,
		tracks[getRandomNumber(tracks.length)].track,
	]);

	return (
		<div className='App'>
			<header className='App-header'>
				<img src={logo} className='App-logo' alt='logo' />
				<h1 className='App-title'>Vous avez +{total} musiques 😍!</h1>
			</header>
			<div className='App-images'>
				<p>Sélectionnez la bonne réponse</p>
				<AlbumCover track={currentTrack} />
				<Sound
					url={currentTrack.preview_url}
					playStatus={Sound.status.PLAYING}
				/>
			</div>
			<div className='App-buttons'>
				{displayedTracks.map(({ id, name }, index) => (
					<Button
						key={`${currentTrack.id}${id}${index}`}
						onClick={() => checkAnswer(id)}
					>
						{name}
					</Button>
				))}
			</div>
		</div>
	);
};

export default App;
