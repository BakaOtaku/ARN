// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/Test.sol";
import {HelloWorldDeploymentLib} from "./utils/HelloWorldDeploymentLib.sol";
import {CoreDeploymentLib} from "./utils/CoreDeploymentLib.sol";
import {UpgradeableProxyLib} from "./utils/UpgradeableProxyLib.sol";
import {StrategyBase} from "@eigenlayer/contracts/strategies/StrategyBase.sol";
import {ERC20Mock} from "../test/ERC20Mock.sol";
import {TransparentUpgradeableProxy} from
    "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import {StrategyFactory} from "@eigenlayer/contracts/strategies/StrategyFactory.sol";
import {StrategyManager} from "@eigenlayer/contracts/core/StrategyManager.sol";
import {IHelloWorldServiceManager} from "../src/IHelloWorldServiceManager.sol";
contract CreateTaskScript is Script {
    IHelloWorldServiceManager helloWorldServiceManager;

    address deployer;
    string constant VIDEO_URL = "https://www.youtube.com/watch?v=KYEPvfPqmdE";
    string constant TASK_CONTENT = "Is there a six hit in this video caption?";
    uint256 constant DEADLINE = 3600; // 1 hour in seconds

    function setUp() public virtual {
        deployer = vm.rememberKey(vm.envUint("PRIVATE_KEY"));
        vm.label(deployer, "Deployer");

        // Replace with the deployed contract address
        address helloWorldServiceManagerAddress = vm.envAddress("HELLO_WORLD_SERVICE_MANAGER_ADDRESS");
        helloWorldServiceManager = IHelloWorldServiceManager(helloWorldServiceManagerAddress);
    }

    function run() external {
        vm.startBroadcast(deployer);

        // Call the createNewTask function
        IHelloWorldServiceManager.Task memory newTask = helloWorldServiceManager.createNewTask(
            VIDEO_URL,
            TASK_CONTENT,
            DEADLINE
        );

        // Log the created task details
        console2.log("Task created:");
        console2.log("Video URL:", newTask.video_url);
        console2.log("Task Content:", newTask.task_content);
        console2.log("Deadline (timestamp):", newTask.deadline);
        console2.log("Created Block:", newTask.taskCreatedBlock);

        vm.stopBroadcast();
    }

}