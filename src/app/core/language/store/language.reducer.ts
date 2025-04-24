import { LanguageType } from '../language.models';
import { LanguageActions, LanguageActionTypes } from './language.actions';

export const languageFeatureKey = 'language';
export const initialState: LanguageType = 'en';

// eslint-disable-next-line @typescript-eslint/default-param-last
export function languageReducer(state: LanguageType = initialState, action: LanguageActions): LanguageType {
  switch (action.type) {
    case LanguageActionTypes.CHANGE_LANGUAGE:
      return action.payload;
    default:
      return state;
  }
}
