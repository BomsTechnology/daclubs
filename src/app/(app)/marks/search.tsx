import { useLocalSearchParams } from 'expo-router';

import SearchScreen from '~/src/components/screen/SearchScreen';

const SearchPage = () => {
  const { query } = useLocalSearchParams();
  return <SearchScreen query={query as string} from="(app)/marks" />;
};

export default SearchPage;
