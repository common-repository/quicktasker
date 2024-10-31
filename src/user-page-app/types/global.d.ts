declare global {
  interface Window {
    wpqt_user: {
      userApiNonce: string;
      siteURL: string;
      pluginURL: string;
      timezone: string;
    };
  }
}

export {};
