{
  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-compat = {
      url = "github:ElvishJerricco/flake-compat/add-overrideInputs";
      flake = false;
    };
  };

  outputs = { self, flake-utils, nixpkgs, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = (import nixpkgs) { inherit system; };

      in rec {
        packages = {
          # FIXME: Can't work yet because nixpkgs needs to add a fetcher for the bun lockfile
          # default = pkgs.stdenv.mkDerivation {
          #     name = "shortcat";
          #     src = pkgs.lib.cleanSource ./.;
          #     nativeBuildInputs = with pkgs; [ bun ];
          #
          #     dontConfigure = true;
          #     buildPhase = "bun build --target=bun src --outfile $result/bin/shortcat";
          # };
            # I'll just run that bun build command. (see devshell)
        };

        # For `nix develop`:
        devShell = pkgs.mkShell {
          nativeBuildInputs = with pkgs; [ bun sqlite ];
        };
      });
}
