declare module "eslint-plugin-import" {
  import type {
    ClassicConfig,
    Linter,
  } from "@typescript-eslint/utils/ts-eslint";
  import eslintNode from "eslint-plugin-node";

  declare const exprt: {
    configs: {
      recommended: ClassicConfig.Config;
      errors: ClassicConfig.Config;
      warnings: ClassicConfig.Config;
      "stage-0": ClassicConfig.Config;
      react: ClassicConfig.Config;
      "react-native": ClassicConfig.Config;
      electron: ClassicConfig.Config;
      typescript: ClassicConfig.Config;
      "eslint-plugin-node": eslintNode;
    };
    rules: NonNullable<Linter.Plugin["rules"]>;
  };
  export = exprt;
}
