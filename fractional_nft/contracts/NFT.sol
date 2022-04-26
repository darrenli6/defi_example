// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


pragma solidity >=0.7.0 <0.9.0;

contract NFT is ERC721Enumerable,Ownable{


    using Strings for uint256;

    uint256 public cost= 1 ether ;
    uint256 public maxSupply = 20;

    string baseURI;
    string public baseExtension= ".json";

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _initBaseURI
    ) ERC721(_name,_symbol){
        setBaseURI(_initBaseURI);
    }
    
    function mint() public payable{
        uint256 supply = totalSupply();

        require(supply <=maxSupply);

        if (msg.sender!=owner()){
            require(msg.value >=cost);
        }
        _safeMint(msg.sender, supply+1);


    }

    function tokenURI(uint256 tokenId) public view virtual override returns(string memory){
         require(_exists(tokenId)," non existent token ");

         string memory currentBaseURI = _baseURI();

         return bytes(currentBaseURI).length>0? string(abi.encodePacked(
             currentBaseURI,tokenId.toString(),baseExtension
         )):"";
    }

    function _baseURI() internal view virtual override returns(string memory){
        return baseURI;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner{
        baseURI = _newBaseURI;
    }

}