#!/usr/bin/env bash

RPC_URL=https://eth-holesky.g.alchemy.com/v2/SVjJuPD_K8GYKymD4E2QSuQF1xiarXME
PRIVATE_KEY=

# cd to the directory of this script so that this can be run from anywhere
parent_path=$(
    cd "$(dirname "${BASH_SOURCE[0]}")"
    pwd -P
)
cd "$parent_path"

cd ../

# forge script script/HelloWorldDeployer.s.sol --rpc-url $RPC_URL --broadcast --private-key $PRIVATE_KEY

forge script script/CreateTask.s.sol --rpc-url $RPC_URL --broadcast --private-key $PRIVATE_KEY

