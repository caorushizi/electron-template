export async function sleep(second = 1): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, second * 1000));
}

export interface IpcResponse {
  code: number;
  message: string;
  data: unknown;
}

export function success(data: unknown): IpcResponse {
  return {
    code: 0,
    message: "success",
    data,
  };
}

export function error(code = -1, message = "fail"): IpcResponse {
  return {
    code,
    message,
    data: null,
  };
}
