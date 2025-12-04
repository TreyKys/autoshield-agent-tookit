// Library of Cures - Verified Smart Contract Templates

export const CURES = {
  REENTRANCY: {
    name: "ReentrancyGuard",
    description: "Prevents reentrant calls to a function.",
    code: `
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;

    /**
     * @dev Contract module that helps prevent reentrant calls to a function.
     */
    abstract contract ReentrancyGuard {
        uint256 private constant _NOT_ENTERED = 1;
        uint256 private constant _ENTERED = 2;

        uint256 private _status;

        constructor() {
            _status = _NOT_ENTERED;
        }

        modifier nonReentrant() {
            require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
            _status = _ENTERED;
            _;
            _status = _NOT_ENTERED;
        }
    }
    `
  },
  ACCESS_CONTROL: {
    name: "Ownable",
    description: "Basic access control mechanism, where there is an account (an owner) that can be granted exclusive access to specific functions.",
    code: `
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;

    abstract contract Ownable {
        address private _owner;

        event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

        constructor() {
            _transferOwnership(msg.sender);
        }

        modifier onlyOwner() {
            require(owner() == msg.sender, "Ownable: caller is not the owner");
            _;
        }

        function owner() public view virtual returns (address) {
            return _owner;
        }

        function _transferOwnership(address newOwner) internal virtual {
            address oldOwner = _owner;
            _owner = newOwner;
            emit OwnershipTransferred(oldOwner, newOwner);
        }
    }
    `
  }
};
