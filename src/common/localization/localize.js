import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './translations/en.json'
import fr from './translations/fr.json'

export async function initLocalizations() {
    return i18next
        .use(LanguageDetector)
        .init({
            fallbackLng: 'en',
            debug: false,
            resources: {
                en: en,
                fr: fr
            }
        }, function(err, t) {})
}
