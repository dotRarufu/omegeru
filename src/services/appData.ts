export type AppData = {
  userId: string;
};

const AppDataStorageKey = 'OmegeruAppData';

export const getAppData = () => {
  const stringified = localStorage.getItem(AppDataStorageKey);
  let appData: AppData = { userId: '' };

  if (stringified === null) return appData;

  appData = JSON.parse(stringified) as AppData;

  return appData;
};

export const saveAppData = (data: AppData) => {
  const stringified = JSON.stringify(data);
  localStorage.setItem(AppDataStorageKey, stringified);
};
