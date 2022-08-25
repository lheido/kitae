import { Config } from "@jest/types";
import projectConfig from "../../jest.config";

const config: Config.InitialOptions = {
  ...projectConfig,
};

export default config;
