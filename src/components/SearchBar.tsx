// src/components/JobSearch.tsx

import * as React from 'react';
import { SearchBar, onSearchFunc } from '@yext/search-ui-react';
import '../index.css';
const Search = (): JSX.Element => {
	const handleSearch: onSearchFunc = (searchEventData) => {
		const { query } = searchEventData;

		const queryParams = new URLSearchParams(window.location.search);

		if (query) {
			window.location.href = `https://answers.regionalfinance.com/?query=${query}`;
		} else {
			queryParams.delete('query');
		}
	};

	return (
		<div className='lg:w-[78vw] extraLarge:w-[410px] xl:w-[425px] search-btn small:w-[225px] md:w-[661px] w-[320px] max-w-[90rem] target-class'>
			<SearchBar
				placeholder='Ask a question...'
				onSearch={handleSearch}
				customCssClasses={{
					searchBarContainer: 'rounded-lg mb-4 lg:my-3  ',
					searchButtonContainer: 'hidden',
					entityPreviewsDivider: 'bg-red-100',
					inputElement: 'border-none text-xs text-[#212121] inline',
					focusedOption: 'bg-red-100',
					// highlighted: 'bg-red-100',
				}}
			/>
		</div>
	);
};

export default Search;
