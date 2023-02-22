// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

// function name() public view returns (string);
// function symbol() public view returns (string);
// function decimals() public view returns (uint8);
// function totalSupply() public view returns (uint256);
// function balanceOf(address _owner) public view returns (uint256 balance);
// function transfer(address _to, uint256 _value) public returns (bool success);
// function transferFrom(address _from, address _to, uint256 _value) public returns (bool success);
// function approve(address _spender, uint256 _value) public returns (bool success);
// function allowance(address _owner, address _spender) public view returns (uint256 remaining);

// event Transfer(address indexed _from, address indexed _to, uint256 _value);
// event Approval(address indexed _owner, address indexed _spender, uint256 _value);

contract Study {
    string public name = "Study";
    string public symbol = "STD";
    uint256 public decimals = 0;
    uint256 public totalSupply = 100000;
    address public founder;
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public approved;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    constructor() {
        founder = msg.sender;
        balances[founder] = totalSupply;
    }

    function balanceOf(address owner) public view returns (uint256 balance) {
        return balances[owner];
    }

    function transfer(address to, uint256 tokens)
        public
        returns (bool success)
    {
        require(
            balances[msg.sender] >= tokens,
            "You do not have enough tokens"
        );
        balances[to] += tokens;
        balances[msg.sender] -= tokens;
        emit Transfer(msg.sender, to, tokens);
        return true;
    }

    function approve(address spender, uint256 tokens)
        public
        returns (bool success)
    {
        require(balances[msg.sender] >= tokens);
        require(tokens > 0);
        approved[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }

    function allowance(address owner, address spender)
        public
        view
        returns (uint256 remainingTokens)
    {
        return approved[owner][spender];
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokens
    ) public returns (bool success) {
        require(approved[from][to] >= tokens);
        require(balances[from] >= tokens);
        balances[from] -= tokens;
        balances[to] += tokens;
        return true;
    }
}
