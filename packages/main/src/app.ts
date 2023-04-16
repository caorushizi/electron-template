import { app } from "electron";
import { inject, injectable } from "inversify";
import {
  DatabaseService,
  IpcHandlerService,
  LoggerService,
  MainWindowService,
  ProtocolService,
  UpdateService,
  type App,
} from "./interfaces";
import isDev from "electron-is-dev";
import installExtension, {
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";
import { TYPES } from "./types";

@injectable()
export default class ElectronApp implements App {
  constructor(
    @inject(TYPES.MainWindowService)
    private readonly mainWindow: MainWindowService,
    @inject(TYPES.ProtocolService)
    private readonly protocolService: ProtocolService,
    @inject(TYPES.UpdateService)
    private readonly updateService: UpdateService,
    @inject(TYPES.IpcHandlerService)
    private readonly ipcHandler: IpcHandlerService,
    @inject(TYPES.DatabaseService)
    private readonly dataService: DatabaseService,
    @inject(TYPES.LoggerService)
    private readonly logger: LoggerService
  ) {}

  async init(): Promise<void> {
    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });

    this.protocolService.create();
    await this.mainWindow.init();
    this.ipcHandler.init();
    this.updateService.init();
    await this.dataService.init();

    if (isDev) {
      try {
        await installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS]);
        this.logger.info("devtools installed");
      } catch (err) {
        this.logger.error("devtools install error", err);
      }
    }
  }
}
