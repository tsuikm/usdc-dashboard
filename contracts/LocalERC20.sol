pragma solidity >=0.4.22 <0.8.0;

import '@openzeppelin/contracts/presets/ERC20PresetMinterPauser.sol';

contract LocalERC20 is ERC20PresetMinterPauser {

  /**
   * Implementation of the {IERC20} interface for local development, using
   * https://github.com/OpenZeppelin/openzeppelin-contracts.
   *
   * Extends the contract defined in
   * https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol
   *
   * See https://docs.openzeppelin.com/contracts/3.x/api/token/erc20 for the full API docs.
   */
  constructor() ERC20PresetMinterPauser('LocalERC20', 'TestToken') public {

    // Use 6 as the decimals.
    _setupDecimals(6);
  }
}