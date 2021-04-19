//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "hardhat/console.sol"

// https://github.com/ERC725Alliance/ERC725/blob/master/implementations/contracts/ERC725/IERC725X.sol
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1271.md
contract EthWill {
  address grantor;
  address executor;
  enum State { Created, Locked, Inactive }
  State public state;

  constructor() {
    console.log("Deploying DeadChain");

    ContractCreated(address(this));
  }

  modifier onlyGrantor() {
    require(msg.sender == grantor);
    _;
  }

  modifier inState(State _state) {
    require(state == _state);
    _;
  }

  event ContractCreated(address indexed contractAddress);
  event Executed(uint256 indexed _operation, address indexed _to, uint256 indexed _value, bytes _data);
  event Aborted();
  event Finalized();

  function setExecutor(address memory _ex) onlyGrantor {
    executor = _ex;
  }

  function abort()
    onlyGrantor
    inState(State.Created)
  {
    Aborted();
    state = State.Inactive;
  }

  function lock()
    onlyGrantor
    inState(State.Created)
  {
    Finalized();
    state = State.Locked;
  }

  function execute(uint256 operationType, address to, uint256 value, bytes calldata data) external payable {

  }

  // This is how 0x did it...
  // https://github.com/0xProject/0x-monorepo/blob/05b35c0fdcbca7980d4195e96ec791c1c2d13398/packages/contracts/src/2.0.0/protocol/Exchange/MixinSignatureValidator.sol#L85
  /// @dev Verifies that a hash has been signed by the given signer.
  /// @param _hash Any 32 byte hash.
  /// @param signerAddress Address that should have signed the given hash.
  /// @param signature Proof that the hash has been signed by signer.
  /// @return True if the address recovered from the provided signature matches the input signer address.
  function isValidSignature(bytes32 _hash, address signerAddress, bytes memory signature) public view returns (bool isValid) {

  }

}
