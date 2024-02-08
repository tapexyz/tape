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
  ) external returns (uint256 profileId, uint256 handleId);
}

contract TapePermissionlessCreator is Initializable, OwnableUpgradeable {
  ILensPermissionlessCreator public lensPermissionlessCreator;
  mapping(uint256 => bool) public profiles;
  uint256 public signupPrice;
  uint256 public totalCount;

  error InvalidFunds();
  error CreateNotAllowed();
  error WithdrawalFailed();

  event ProfileCreated(uint256 profileId, uint256 handleId, string handle);

  function initialize(
    address ownerAddress,
    address lensPermissionlessCreatorAddress,
    uint256 _signupPrice
  ) internal initializer {
    __Ownable_init(ownerAddress);
    lensPermissionlessCreator = ILensPermissionlessCreator(
      lensPermissionlessCreatorAddress
    );
    signupPrice = _signupPrice;
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
      revert CreateNotAllowed();
    }

    (profileId, handleId) = lensPermissionlessCreator
      .createProfileWithHandleUsingCredits(
        createProfileParams,
        handle,
        delegatedExecutors
      );

    profiles[profileId] = true;
    totalCount++;

    emit ProfileCreated(profileId, handleId, handle);

    return (profileId, handleId);
  }

  function withdrawFunds() external onlyOwner {
    (bool success, ) = payable(owner()).call{value: address(this).balance}('');
    if (!success) {
      revert WithdrawalFailed();
    }
  }

  function setSignupPrice(uint256 _signupPrice) external onlyOwner {
    signupPrice = _signupPrice;
  }
}
