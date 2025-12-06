import type { StackScreenProps } from '@react-navigation/stack';

/**
 * Tipos de navegação para a stack de autenticação
 */
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

/**
 * Tipos de navegação para a stack principal do app
 */
export type AppStackParamList = {
  MainTabs: undefined;
  Home: undefined;
  Schedule: undefined;
  History: undefined;
  Profile: undefined;
  News: undefined;
  Pharmacies: undefined;
  Medications: undefined;
  EditProfile: undefined;
};

/**
 * Tipos de props para as telas de autenticação
 */
export type AuthScreenProps<T extends keyof AuthStackParamList> =
  StackScreenProps<AuthStackParamList, T>;

/**
 * Tipos de props para as telas do app
 */
export type AppScreenProps<T extends keyof AppStackParamList> =
  StackScreenProps<AppStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AuthStackParamList, AppStackParamList {}
  }
}
