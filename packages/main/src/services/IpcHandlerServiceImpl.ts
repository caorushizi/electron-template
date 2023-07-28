import { ipcMain } from "electron";
import { injectable, multiInject } from "inversify";
import { Controller, IpcHandlerService } from "../interfaces";
import { TYPES } from "../types";
import { error, success } from "helper/utils";

@injectable()
export default class IpcHandlerServiceImpl implements IpcHandlerService {
  constructor(
    @multiInject(TYPES.Controller) private readonly controllers: Controller[]
  ) {}

  private registerIpc(controller: Controller, property: string | symbol): void {
    const fun = controller[property];
    const channel: string = Reflect.getMetadata(
      "ipc-channel",
      controller,
      property
    );
    const method: "on" | "handle" = Reflect.getMetadata(
      "ipc-method",
      controller,
      property
    );
    if (typeof fun === "function" && method && channel) {
      ipcMain[method](channel, async (...args: any[]) => {
        try {
          const handler = fun.bind(controller);
          let res = handler(...args);
          if (res.then) {
            res = await res;
          }
          return success(res);
        } catch (e: any) {
          return error(-1, e.message);
        }
      });
    }
  }

  private bindIpcMethods(controller: Controller): void {
    const Class = Object.getPrototypeOf(controller);
    Object.getOwnPropertyNames(Class).forEach((property) =>
      this.registerIpc(controller, property as never)
    );
  }

  init(): void {
    this.controllers.forEach((controller) => this.bindIpcMethods(controller));
  }
}
