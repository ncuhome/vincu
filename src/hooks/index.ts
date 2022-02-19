import { useColorScheme } from 'react-native';

const colors = {
  deepBg: '#fff',
  bg: '#eee',
};

const darkColors = {
  deepBg: '#000',
  bg: '#222',
};

export const useColors = () => {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkColors : colors;
};
