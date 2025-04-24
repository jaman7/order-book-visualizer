import { LanguageType } from '../language.models';
import { Action } from '@ngrx/store';

export enum LanguageActionTypes {
  CHANGE_LANGUAGE = '[Language] Change Language',
}

export class ActionLanguageChange implements Action {
  readonly type = LanguageActionTypes.CHANGE_LANGUAGE;

  constructor(public payload: LanguageType) {}
}

export type LanguageActions = ActionLanguageChange;
