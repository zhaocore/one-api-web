import { useCallback, useEffect } from 'react';
import { TOptions } from 'i18next';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';
import { langAtom } from '~/store';

export default function useLocalize() {
  const lang = useAtomValue(langAtom);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  return useCallback(
    (phraseKey: string, options?: TOptions) => t(phraseKey, options),
    [t],
  );
}
