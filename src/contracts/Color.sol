pragma solidity 0.5.0;

import "./ERC721Full.sol";

//code for the token
contract Color is ERC721Full {
    string[] public colors;
    mapping(string => bool) _colorExists; //checks color

    constructor() ERC721Full("Color", "COLOR") public{
    }

    function mint(string memory _color) public {
        //Require unique color
        require(!_colorExists[_color]);
        uint _id = colors.push(_color);
        _mint(msg.sender, _id);
        //Color - add it
        //Call mint()
        //Color - track it
        _colorExists[_color] = true;
    }
}

//specific id of token is hex value of colors
