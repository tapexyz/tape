// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

struct CreateProfileParams {
  address to;
  address followModule;
  bytes followModuleInitData;
}

interface ILensPermissonlessCreator {
  function createProfileWithHandleUsingCredits(
    CreateProfileParams calldata createProfileParams,
    string calldata handle,
    address[] calldata delegatedExecutors
  ) external returns (uint256 profileId, uint256 handleId);
}

contract TapePermissonlessCreator is Initializable, OwnableUpgradeable {
  ILensPermissonlessCreator public LENS_PERMISSONLESS_CREATOR;
  uint256 public signupPrice;

  error InvalidFunds();
  error NotAllowed();
  error WithdrawFailed();

  function initialize(
    address tapeOwner,
    address lensPermissonlessCreatorAddress
  ) public initializer {
    __Ownable_init(tapeOwner);
    LENS_PERMISSONLESS_CREATOR = ILensPermissonlessCreator(
      lensPermissonlessCreatorAddress
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
      LENS_PERMISSONLESS_CREATOR.createProfileWithHandleUsingCredits(
        createProfileParams,
        handle,
        delegatedExecutors
      );
  }

  function withdrawFunds() external onlyOwner {
    (bool success, ) = payable(owner()).call{value: address(this).balance}('');
    if (!success) {
      revert WithdrawFailed();
    }
  }

  function setSignupPrice(uint256 _signupPrice) external onlyOwner {
    signupPrice = _signupPrice;
  }
}
