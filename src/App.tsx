import React, { useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import CitiesList from './components/CitiesList';
import CityDetails from './components/CityDetails';


const App: React.FC = () => {
	const [ selectedCity, setSelectedCity ] = useState<string | null>(null);

	return (
		<>
			<CssBaseline />

			<Box sx={{ display: 'flex', p: 4, alignItems: 'flex-start' }}>
				<CitiesList
					selectedCity={selectedCity}
					setSelectedCity={setSelectedCity}
				/>

				<CityDetails
					selectedCity={selectedCity}
				/>
			</Box>
		</>
	);
};

export default App;
