import {useMemo} from 'react';
import {useTheme} from '../theme/theme';

const useThemed = whatever => {
  const theme = useTheme();

  const themed = useMemo(() => whatever(theme), [whatever, theme]);

  return themed;
};

export {useThemed};
