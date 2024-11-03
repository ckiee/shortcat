{
  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-compat = {
      url = "github:ElvishJerricco/flake-compat/add-overrideInputs";
      flake = false;
    };
  };

  outputs = { self, flake-utils, naersk, nixpkgs, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = (import nixpkgs) {
          inherit system;
        };

        naersk' = pkgs.callPackage naersk {};

      in rec {
        # For `nix build` & `nix run`:
        # defaultPackage = naersk'.buildPackage {
        #   src = ./.;
        # };

        # For `nix develop`:
        devShell = pkgs.mkShell {
          nativeBuildInputs = with pkgs; [ bun sqlite ];
        };
      }
    );
}
