import { ReactElement } from 'react';
import { Toaster } from 'react-hot-toast';
import LoadingBar from 'react-top-loading-bar';
import useStore from './hooks/store/useStore.ts';

type AppProps = {
	page: ReactElement;
};

function App({ page }: AppProps) {
	const loaderProgress = useStore((state) => state.loaderProgress);
	const setLoaderProgress = useStore((state) => state.setLoaderProgress);

	return (
		<>
			<Toaster containerStyle={{ top: 30 }} />
			<LoadingBar
				color='#C8ED5A'
				progress={loaderProgress}
				onLoaderFinished={() => setLoaderProgress && setLoaderProgress(0)}
			/>
			{page}
		</>
	);
}

export default App;
