{ inputs, ... }:
{
  imports = [
    (inputs.treefmt-nix.flakeModule or { })
  ];
  perSystem =
    {
      inputs',
      lib,
      pkgs,
      ...
    }:
    lib.optionalAttrs (inputs.treefmt-nix ? flakeModule) {
      treefmt = {
        programs = {
          jsonfmt = {
            enable = true;
            excludes = [
              "public/blog/feed.json"
            ];
          };
          mdformat = {
            enable = true;
            plugins =
              ps: with ps; [
                mdformat-gfm
              ];
            settings = {
              end-of-line = "lf";
              number = true;
              wrap = 80;
            };
          };
          nixfmt.enable = true;
          rustfmt = {
            edition = "2024";
            enable = true;
            package = inputs'.fenix.packages.latest.rustfmt;
          };
          shellcheck = {
            enable = true;
            excludes = [
              ".envrc"
            ];
          };
          shfmt = {
            enable = true;
            indent_size = 4;
          };
          taplo.enable = true;
        };
        settings.formatter.jsonfmt =
          let
            jsonfmt = pkgs.callPackage ./jsonfmt.nix { };
          in
          {
            command = "${jsonfmt}/bin/jf";
            options = lib.mkForce [ ];
            package = jsonfmt;
          };
      };
    };
}
