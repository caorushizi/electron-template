const eventFun = ["rendererEvent", "removeEventListener"];

const electronApi = Object.keys(window.electron).reduce<any>((res, funName) => {
  const fun = async (...args: any[]) => {
    const electronFun = (window.electron as any)[funName];
    if (eventFun.includes(funName) || funName.startsWith("send")) {
      return electronFun(...args);
    }

    const { code, data, message } = await electronFun(...args);
    if (code !== 0) {
      return Promise.reject(new Error(message));
    }
    return data;
  };
  res[funName] = fun;
  return res;
}, {});

export default function useElectron(): ElectronAPI {
  return electronApi;
}
