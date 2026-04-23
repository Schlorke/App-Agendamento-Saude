// Workaround para bug do Expo SDK 54 com prebuild
// O prebuild pode falhar com erro relacionado a MainApplication
// Para desenvolvimento, use: npx expo start (não requer prebuild)
// Para produção, use: eas build (não requer prebuild local)

module.exports = {
  expo: {
    name: 'HoW',
    slug: 'HoW',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: false,
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.how.agendamento',
    },
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
      name: 'HoW — Agendamento Saúde',
      shortName: 'HoW',
      lang: 'pt',
      themeColor: '#2E7D32',
      backgroundColor: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
    },
    plugins: [],
  },
};
