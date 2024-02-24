// SPDX-License-Identifier: AGPL-3.0
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
  mapping(uint256 => string) public profiles;
  mapping(address => bool) public allowedRelayerAddresses;

  uint256 public signupPrice;
  uint256 public totalCountViaCard;
  uint256 public totalCountViaCrypto;

  error InvalidFunds();
  error CreateNotAllowed();
  error WithdrawalFailed();

  modifier onlyAllowed() {
    require(
      allowedRelayerAddresses[msg.sender],
      'TapePermissionlessCreator: Not allowed'
    );
    _;
  }

  event ProfileCreated(uint256 profileId, uint256 handleId, string handle);

  function initialize(
    address ownerAddress,
    address lensPermissionlessCreatorAddress
  ) public initializer {
    __Ownable_init(ownerAddress);
    lensPermissionlessCreator = ILensPermissionlessCreator(
      lensPermissionlessCreatorAddress
    );
    signupPrice = 10 ether;
  }

  function addAllowedRelayerAddresses(
    address[] calldata newAddresses
  ) external onlyOwner {
    for (uint256 i = 0; i < newAddresses.length; i++) {
      allowedRelayerAddresses[newAddresses[i]] = true;
    }
  }

  function removeAllowedRelayerAddress(address addressToRemove) external onlyOwner {
    allowedRelayerAddresses[addressToRemove] = false;
  }

  function createProfileWithHandle(
    CreateProfileParams calldata createProfileParams,
    string calldata handle,
    address[] calldata delegatedExecutors
  ) external onlyAllowed returns (uint256 profileId, uint256 handleId) {
    (profileId, handleId) = lensPermissionlessCreator
      .createProfileWithHandleUsingCredits(
        createProfileParams,
        handle,
        delegatedExecutors
      );

    profiles[profileId] = handle;
    totalCountViaCard++;

    emit ProfileCreated(profileId, handleId, handle);

    return (profileId, handleId);
  }

  function createProfileWithHandleUsingCredits(
    CreateProfileParams calldata createProfileParams,
    string calldata handle,
    address[] calldata delegatedExecutors
  ) external payable returns (uint256 profileId, uint256 handleId) {
    if (msg.value < signupPrice) {
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

    profiles[profileId] = handle;
    totalCountViaCrypto++;

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

  function setLensPermissionlessCreatorAddress(
    address creatorAddress
  ) external onlyOwner {
    lensPermissionlessCreator = ILensPermissionlessCreator(creatorAddress);
  }
}
