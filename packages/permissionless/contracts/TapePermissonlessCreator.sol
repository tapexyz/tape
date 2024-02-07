// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

struct CreateProfileParams {
  address to;
  address followModule;
  bytes followModuleInitData;
}

interface ILensPermissionlessCreator {
  function createProfileWithHandleUsingCredits(
    CreateProfileParams calldata createProfileParams,
    string calldata handle,
    address[] calldata delegatedExecutors
  ) external returns (uint256, uint256);
}

contract TapePermissionlessCreator is Initializable, OwnableUpgradeable {
  ILensPermissionlessCreator public lensPermissionlessCreator;
  uint256 public signupPrice;

  error InvalidFunds();
  error NotAllowed();
  error WithdrawalFailed();

  function initialize(
    address tapeOwnerAddress,
    address lensPermissionlessCreatorAddress
  ) public initializer {
    __Ownable_init(tapeOwnerAddress);
    lensPermissionlessCreator = ILensPermissionlessCreator(
      lensPermissionlessCreatorAddress
    );
    signupPrice = 1 ether;
  }

  function createProfileWithHandleUsingCredits(
    CreateProfileParams calldata createProfileParams,
    string calldata handle,
    address[] calldata delegatedExecutors
  ) external payable returns (uint256 profileId, uint256 handleId) {
    if (msg.value != signupPrice) {
      revert InvalidFunds();
    }

    if (delegatedExecutors.length > 0 && createProfileParams.to != msg.sender) {
      revert NotAllowed();
    }

    return
      lensPermissionlessCreator.createProfileWithHandleUsingCredits(
        createProfileParams,
        handle,
        delegatedExecutors
      );
  }

  function withdrawFunds() external onlyOwner {
    (bool success, ) = payable(owner()).call{value: address(this).balance}('');
    if (!success) {
      revert WithdrawalFailed();
    }
  }

  function setSignupPrice(uint256 price) external onlyOwner {
    signupPrice = price;
  }
}
