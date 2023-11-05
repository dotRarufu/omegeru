export type AppData = {
  userId: string;
  sessionId: string | null;
};

const AppDataStorageKey = 'OmegeruAppData';

export const getAppData = () => {
  const stringified = localStorage.getItem(AppDataStorageKey);

  // todo: deal with falsy values
  // let appData: AppData = { userId: '', sessionId: null };
  if (!stringified) return null;

  const appData = JSON.parse(stringified) as AppData;
  return appData;
};

export const saveAppData = (data: AppData) => {
  const stringified = JSON.stringify(data);
  localStorage.setItem(AppDataStorageKey, stringified);
};
