import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';

type TranslationFormProps = {
	isNew?: boolean;
	city: string;
	language?: string;
	name?: string;
	setTranslations: (translations: []) => void;
};

const TranslationForm: React.FC<TranslationFormProps> = ({ isNew = false, city, language = '', name = '', setTranslations }) => {
	const [ loading, setLoading ] = useState<boolean>(false);
	const [ languageValue, setLanguageValue ] = useState<string>(language);
	const [ nameValue, setNameValue ] = useState<string>(name);

	useEffect(() => {
		setLanguageValue(language);
		setNameValue(name);
	}, [ language, name ]);

	const updateTranslation = async () => {
		setLoading(true);

		try {
			const reqUpdate = await fetch(`/api/testgame/cities/${city}/translations`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					language: languageValue,
					name: nameValue
				})
			});

			if (reqUpdate.ok) {
				const resUpdate = await reqUpdate.json();

				if (resUpdate.error === null) {
					setTranslations(resUpdate.data);
					setLanguageValue(language);
					setNameValue(name);
				}
				else {
					console.log('Error updating city', resUpdate.error);
				}
			}
			else {
				console.log('Error updating city', reqUpdate.status, reqUpdate.statusText);
			}
		}
		catch(err) {
			console.log('Error updating city', err);
		}

		setLoading(false);
	};

	return (
		<>
			<TextField
				label="Language"
				size="small"
				disabled={!isNew}
				value={languageValue}
				onChange={e => setLanguageValue(e.target.value)}
				sx={{ flex: '1 1 33%', mr: 2 }}
			/>

			<TextField
				label="Name"
				size="small"
				value={nameValue}
				onChange={e => setNameValue(e.target.value)}
				sx={{ flex: '1 1 67%', mr: 2 }}
			/>

			<Box sx={{ position: 'relative' }}>
				<Button
					variant="contained"
					disabled={languageValue.length === 0 || nameValue.length === 0}
					onClick={updateTranslation}
					sx={{ flex: '0 0 auto', opacity: loading ? 0 : 1 }}
				>
					{isNew ? 'Add' : 'Save'}
				</Button>

				{loading && (
					<Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
						<CircularProgress size={20} />
					</Box>
				)}
			</Box>
		</>
	);
};

export default TranslationForm;
