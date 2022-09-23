import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TranslationForm from './TranslationForm';
import City from '../types/City';
import LocatedIn from './LocatedIn';

type CityFormProps = {
	selectedCity: string | null;
};

const CityDetails: React.FC<CityFormProps> = ({ selectedCity }) => {
	const [ loading, setLoading ] = useState<boolean>(false);
	const [ translations, setTranslations ] = useState<City[]>([]);

	useEffect(() => {
		if (selectedCity !== null) {
			(async () => {
				setLoading(true);

				try {
					const reqTranslations = await fetch(`/api/testgame/cities/${selectedCity}/translations`);

					if (reqTranslations.ok) {
						const translations = await reqTranslations.json();
						setTranslations(translations || null);
					}
					else {
						console.log('Error fetching city', reqTranslations.status, reqTranslations.statusText);
					}
				}
				catch(err) {
					console.log('Error fetching city', err);
				}

				setLoading(false);
			})();
		}
	}, [ selectedCity ]);

	return (
		<Paper sx={{ flex: '1 1 75%', px: 4 }}>
			{selectedCity !== null && (
				<>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<Typography variant="h4" sx={{ mt: 4, mb: 6 }}>{selectedCity}</Typography>
						<LocatedIn selectedCity={selectedCity} />
					</Box>

					{loading ? (
						<LinearProgress sx={{ width: '100%', mb: 4 }} />
					) : (
						<>
							{Object.keys(translations).length ? (
								<>
									{Object.keys(translations).map((t: any) => (
										<Box key={t} sx={{ display: 'flex', width: '100%', mb: 2 }}>
											<TranslationForm
												city={selectedCity}
												language={translations[t]?.references?.language}
												name={translations[t]?.references?.name}
												setTranslations={setTranslations}
											/>
										</Box>
									))}
								</>
							) : (
								<Alert severity="info" variant="outlined">No translations found.</Alert>
							)}
						</>
					)}

					<Divider sx={{ my: 4 }} />

					<Box sx={{ display: 'flex', width: '100%', mb: 4 }}>
						<TranslationForm
							isNew
							city={selectedCity}
							setTranslations={setTranslations}
						/>
					</Box>
				</>
			)}
		</Paper>
	);
};

export default CityDetails;
