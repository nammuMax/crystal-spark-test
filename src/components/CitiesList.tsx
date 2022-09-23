import React, { useEffect, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import City from '../types/City';

type CitiesListProps = {
	selectedCity: string | null;
	setSelectedCity: (cityName: string) => void;
};

const CitiesList: React.FC<CitiesListProps> = ({ selectedCity, setSelectedCity }) => {
	const [ loading, setLoading ] = useState<boolean>(false);
	const [ cities, setCities ] = useState<City[]>([]);

	useEffect(() => {
		(async () => {
			setLoading(true);

			try {
				const reqCities = await fetch('/api/testgame/cities');

				if (reqCities.ok) {
					const cities = await reqCities.json();
					setCities(cities?.factory?.entities || []);
				}
				else {
					console.log('Error fetching cities', reqCities.status, reqCities.statusText);
				}
			}
			catch(err) {
				console.log('Error fetching cities', err);
			}

			setLoading(false);
		})();
	}, []);

	const handleSelect = (name : string) : void => {
		setSelectedCity(name);
	};

	return (
		<Paper sx={{ flex: '0 0 25%', mr: 4 }}>
			<Typography variant="h5" sx={{ pl: 2, my: 2 }}>Cities</Typography>

			{loading && (<LinearProgress sx={{ width: 'calc(100% - 32px)', mx: 2 }} />)}

			<List>
				{cities.map((city: City) => (
					<ListItemButton
						key={city?.entity?.id}
						selected={selectedCity === city?.references?.name}
						onClick={() => handleSelect(city?.references?.name)}
					>
						{city?.references?.name}
					</ListItemButton>
				))}
			</List>
		</Paper>
	);
};

export default CitiesList;
