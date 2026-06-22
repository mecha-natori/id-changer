{ inputs, ... }:
{
  imports = [
    (inputs.git-hooks.flakeModule or { })
  ];
  perSystem =
    { config, lib, ... }:
    lib.optionalAttrs (inputs.git-hooks ? flakeModule) {
      pre-commit = {
        check.enable = true;
        settings = {
          hooks = {
            actionlint.enable = true;
            check-json.enable = true;
            check-toml.enable = true;
            markdownlint = {
              enable = true;
              settings.configuration = {
                MD013 = false;
                MD024 = false;
                MD026 = false;
                MD033 = false;
              };
            };
            treefmt = {
              enable = true;
              package = config.treefmt.build.wrapper;
            };
            yamllint = {
              enable = true;
              excludes = [
                "pnpm-lock.yaml"
                "pnpm-workspace.yaml"
              ];
            };
          };
          src = ../.;
        };
      };
    };
}
