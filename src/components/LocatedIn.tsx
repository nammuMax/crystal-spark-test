import React, { useEffect, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Country from '../types/Country';

type LocatedInProps = {
	selectedCity: string | null;
};

const LocatedIn: React.FC<LocatedInProps> = ({ selectedCity }) => {
	const [ loading, setLoading ] = useState<boolean>(false);
	const [ countries, setCountries ] = useState<Country[]>([]);
	const [ selectedCountry, setSelectedCountry ] = useState<string>('');

	useEffect(() => {
		(async () => {
			try {
				const reqCountries = await fetch('/api/testgame/countries');

				if (reqCountries.ok) {
					const countries = await reqCountries.json();
					setCountries(countries?.factory?.entities || []);
				}
				else {
					console.log('Error fetching countries', reqCountries.status, reqCountries.statusText);
				}
			}
			catch(err) {
				console.log('Error fetching countries', err);
			}
		})();
	}, []);

	useEffect(() => {
		(async () => {
			try {
				const reqCityCountry = await fetch(`/api/testgame/cities/${selectedCity}/country`);

				if (reqCityCountry.ok) {
					const { country } = await reqCityCountry.json();
					setSelectedCountry(country);
				}
				else {
					console.log('Error fetching countries', reqCityCountry.status, reqCityCountry.statusText);
				}
			}
			catch(err) {
				console.log('Error fetching countries', err);
			}
		})();
	}, [ selectedCity ]);

	const updateCountry = async (e: any) => {
		setLoading(true);

		try {
			const reqUpdate = await fetch(`/api/testgame/cities/${selectedCity}/country`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					country: e.target.value,
				})
			});

			if (reqUpdate.ok) {
				const resUpdate = await reqUpdate.json();

				if (resUpdate.error === null) {
					setSelectedCountry(e.target.value);
				}
				else {
					console.log('Error updating country', resUpdate.error);
				}
			}
			else {
				console.log('Error updating country', reqUpdate.status, reqUpdate.statusText);
			}
		}
		catch(err) {
			console.log('Error updating country', err);
		}

		setLoading(false);
	};

	return (
		<TextField
			label="Located In"
			select
			size="small"
			disabled={loading}
			value={selectedCountry}
			onChange={updateCountry}
			sx={{ width: 200 }}
		>
			{countries.map((country: Country) => (
				<MenuItem key={country?.entity?.id} value={country?.references?.name}>
					{country?.references?.name}
				</MenuItem>
			))}
		</TextField>
	);
};

export default LocatedIn;
