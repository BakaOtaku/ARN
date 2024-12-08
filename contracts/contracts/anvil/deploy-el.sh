#!/usr/bin/env bash

RPC_URL=https://ethereum-holesky-rpc.publicnode.com
PRIVATE_KEY=

# cd to the directory of this script so that this can be run from anywhere
parent_path=$(
    cd "$(dirname "${BASH_SOURCE[0]}")"
    pwd -P
)
cd "$parent_path"

cd ../

forge script script/DeployEigenLayerCore.s.sol --rpc-url $RPC_URL --broadcast --private-key $PRIVATE_KEY