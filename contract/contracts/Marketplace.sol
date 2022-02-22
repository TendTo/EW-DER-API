// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4 <0.9.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "./Identity/IdentityManager.sol";

/**
 * @title Marketplace
 * @dev The Marketplace is a registry for holding offers, demands, and agreements, called matches.
 * @dev Improvements:
 * @dev - Add a cron string for both offers and demands to indicate the timeslot selected.
 * @dev - Create a server to handle and dispatch the requests from the frontend.
 * @dev - Remove most of the data stored on chain to move it to the server or on IPFS.
 * @dev - Define the role of aggregators.
 * @dev - Add more stats to improve the matching process (timestamp, time to match, matches rejected, etc.).
 */
contract Marketplace {
    IdentityManager private _identityManager;

    struct Offer {
        uint256 matches; // number of matches already approved for this offer. An offer can be matched multiple times
        // string cron; // cron schedule of when the asset is able to provide the service
        uint256 volume; // volume provided by the seller in KW
        uint256 remainingVolume; // volume that is still available for the offer
        uint256 price; // price the seller is willing to sell at in ct/KWh
    }

    struct Demand {
        bool isMatched; // wether the demand has been matched or not. A demand can only be matched once
        uint256 volume; // volume provided by the seller in KW
        uint256 price; // price the buyer is willing to buy at in ct/KWh
    }

    struct Match {
        address asset; // address (DID) of the seller
        address buyer; // address (DID) of the buyer
        uint256 volume; // volume requested by the buyer in KW
        uint256 price; // price the seller is willing to sell at in ct/KWh
        bool isAccepted; // wether the match has been accepted or is still pending as a proposal
    }

    uint256 private _currentMatchId = 0;

    // List of all offers in the marketplace by asset (identified by its address/DID)
    mapping(address => Offer) public offers;
    // List of all demands in the marketplace by interested user
    mapping(address => Demand) public demands;
    // List of all matches proposed but not yet accepted by matchId
    mapping(uint256 => Match) public matches;

    /**************************************************************************
     * Events
     **************************************************************************/
    /**
     * @notice A new offer has been added to the marketplace
     * @param asset address (DID) of the asset
     * @param volume volume provided by the seller in KW
     * @param price price the seller is willing to sell at in ct/KWh
     */
    event OfferCreated(address indexed asset, uint256 volume, uint256 price);
    /**
     * @notice A previously issued offer has been cancelled
     * @param asset address (DID) of the asset
     */
    event OfferCancelled(address indexed asset);
    /**
     * @notice A new demand has been added to the marketplace
     * @param buyer address of the buyer
     * @param volume volume requested by the buyer in KW
     * @param price price the buyer is willing to buy at in ct/KWh
     */
    event DemandCreated(address indexed buyer, uint256 volume, uint256 price);
    /**
     * @notice A previously issued demand has been cancelled
     * @param buyer address of the buyer
     */
    event DemandCancelled(address indexed buyer);
    /**
     * @notice A new match has been proposed by the aggregator
     * @param matchId unique identifier of the match
     * @param asset address (DID) of the seller
     * @param buyer address of the buyer
     */
    event MatchProposed(
        uint256 indexed matchId,
        address indexed asset,
        address indexed buyer
    );
    /**
     * @notice A proposed match has been cacelled by the aggregator
     * @param matchId unique identifier of the match
     */
    event MatchCancelled(uint256 indexed matchId);
    /**
     * @notice A proposed match has been accepted by the buyer
     * @param matchId unique identifier of the match
     */
    event MatchAccepted(uint256 indexed matchId);
    /**
     * @notice A proposed match has been rejected by the buyer
     * @param matchId unique identifier of the match
     */
    event MatchRejected(uint256 indexed matchId);
    /**
     * @notice A previously accepted match has been deleted by the buyer or by the asset owner
     * @param matchId unique identifier of the match
     */
    event MatchDeleted(uint256 indexed matchId);

    /**************************************************************************
     * Modifiers
     **************************************************************************/
    /**
     * @notice Make sure both volume and price are greater than 0
     * @param _volume volume provided by the seller in KW
     * @param _price price the seller is willing to sell at in ct/KWh
     */
    modifier validProposal(uint256 _volume, uint256 _price) {
        require(_volume > 0, "Capacity must be greater than 0");
        require(_price > 0, "Price must be greater than 0");
        _;
    }
    /**
     * @notice Make sure the action is carried out by the aggregator
     * todo the _aggregator should be a variable or should be set according to some logic
     * @param _aggregator address of the aggregator
     */
    modifier isAggregator(address _aggregator) {
        require(
            msg.sender == _aggregator,
            "This action can only be carried out by an aggregator"
        );
        _;
    }
    /**
     * @notice Make sure the action is carried out by the asset owner
     * @param _asset address (DID) of the asset
     */
    modifier isAssetOwner(address _asset) {
        require(_asset != address(0), "Asset address cannot be 0x0");
        require(
            msg.sender == _identityManager.identityOwner(_asset),
            "This action can only be carried out by the asset owner"
        );
        _;
    }
    /**
     * @notice Make sure the asset is not already matched
     * @param _asset address (DID) of the asset
     */
    modifier isAssetUnmatched(address _asset) {
        require(
            offers[_asset].matches == 0,
            "This action can only be carried out when the asset is unmatched"
        );
        _;
    }
    /**
     * @notice Make sure the demand is not already matched
     */
    modifier isDemandUnmatched() {
        require(
            !demands[msg.sender].isMatched,
            "This action can only be carried out when the demand is unmatched"
        );
        _;
    }
    /**
     * @notice The match exists
     * @param _matchId unique identifier of the match
     */
    modifier matchExists(uint256 _matchId) {
        require(matches[_matchId].volume > 0, "The match doesn't exists");
        _;
    }
    /**
     * @notice The match has yet to be accepted by the buyer
     * @param _matchId unique identifier of the match
     */
    modifier isMatchPending(uint256 _matchId) {
        require(matches[_matchId].volume > 0, "The match doesn't exists");
        require(
            !matches[_matchId].isAccepted,
            "The match has already been accepted"
        );
        _;
    }
    /**
     * @notice The match has already been accepted by the buyer
     * @param _matchId unique identifier of the match
     */
    modifier isMatchAccepted(uint256 _matchId) {
        require(matches[_matchId].volume > 0, "The match doesn't exists");
        require(
            matches[_matchId].isAccepted,
            "The match must still be accepted"
        );
        _;
    }

    /**************************************************************************
     * Constructor
     **************************************************************************/
    /**
     * @notice Constructor of the Marketplace contract
     * @param _identityManagerAddress address of the IdentityManager contract,
     * used to check the validity of the assets and their owners
     */
    constructor(address _identityManagerAddress) {
        _identityManager = IdentityManager(_identityManagerAddress);
    }

    /**************************************************************************
     * Internal functions
     **************************************************************************/
    /**
     * @notice Updates both the offers and the demands signaling the removal of the match
     * @param _matchId id of the match to remove
     */
    function cleanupAfterMatchRemoval(uint256 _matchId) internal {
        Match memory _match = matches[_matchId];
        offers[_match.asset].remainingVolume += _match.volume;
        offers[_match.asset].matches--;
        demands[_match.buyer].isMatched = false;
        delete matches[_matchId];
    }

    /**************************************************************************
     * External functions
     **************************************************************************/
    /**
     * @notice Create a new offer linked to a specific asset
     * @dev The address that submits the offer must be the owner of the asset
     * @dev The volume must be greater than 0
     * @dev The price must be greater than 0
     * @dev The offed must not be already matched, for it will be overwritten
     * @param _asset address (DID) of the asset
     * @param _volume volume of the asset in KW
     * @param _price price of the energy provided in ct/KWh
     */
    function createOffer(
        address _asset,
        uint256 _volume,
        uint256 _price
    )
        external
        validProposal(_volume, _price)
        isAssetOwner(_asset)
        isAssetUnmatched(_asset)
    {
        offers[_asset] = Offer(0, _volume, _volume, _price);
        emit OfferCreated(_asset, _volume, _price);
    }

    /**
     * @notice Cancels a previously issued offer. Can only be performed if the offer is not matched
     * @dev The address that cancels the offer must be the owner of the asset
     * @dev The offer must exist
     * @dev The offer must not be matched
     * @param _asset address (DID) of the asset
     */
    function cancelOffer(address _asset)
        external
        isAssetOwner(_asset)
        isAssetUnmatched(_asset)
    {
        require(offers[_asset].volume != 0, "Offer does not exist");

        delete offers[_asset];
        emit OfferCancelled(_asset);
    }

    /**
     * @notice Create a new demand
     * @dev The volume must be greater than 0
     * @dev The price must be greater than 0
     * @dev The demand must not be already matched, for it will be overwritten
     * @param _volume volume of the asset in KW
     * @param _price price of the energy provided in ct/KWh
     */
    function createDemand(uint256 _volume, uint256 _price)
        external
        validProposal(_volume, _price)
        isDemandUnmatched
    {
        demands[msg.sender] = Demand(false, _volume, _price);
        emit DemandCreated(msg.sender, _volume, _price);
    }

    /**
     * @notice Cancels a previously issued demand
     * @dev The demand must exist
     * @dev The demand must not be matched
     */
    function cancelDemand() external isDemandUnmatched {
        require(demands[msg.sender].volume != 0, "Demand does not exist");

        delete demands[msg.sender];
        emit DemandCancelled(msg.sender);
    }

    /**
     * @notice Propose a match between an offer and a demand
     * @dev The demand must exist
     * @dev The demand must not be matched
     * @dev The offer must exist
     * @dev The offer must not be matched
     * @dev The volume of the demand must be greater than the volume of the offer
     * @dev The price of the demand must be greater than the price of the offer
     * todo Stronger check to make sure the offer volume is respected from multiple matches
     * @param _asset address (DID) of the asset
     * @param _buyer address of the buyer
     * @param _buyer address of the buyer
     * @param _buyer address of the buyer
     */
    function proposeMatch(
        address _asset,
        address _buyer,
        uint256 _volume,
        uint256 _price
    ) external isAggregator(_buyer) {
        require(offers[_asset].volume > 0, "Offer does not exist");
        require(demands[_buyer].volume > 0, "Demand does not exist");
        require(!demands[_buyer].isMatched, "Demand is already matched");
        require(offers[_asset].price <= _price, "Demand price is too low");
        require(
            offers[_asset].remainingVolume >= _volume,
            "Offer remaining volume is too low"
        );
        _currentMatchId++;
        matches[_currentMatchId] = Match(
            _asset,
            _buyer,
            _volume,
            _price,
            false
        );
        offers[_asset].matches++;
        offers[_asset].remainingVolume -= _volume;
        demands[_buyer].isMatched = true;
        emit MatchProposed(_currentMatchId, _asset, _buyer);
    }

    /**
     * @notice Cancel a previously proposed match
     * @dev Only the aggregator can perform this operation
     * @dev The match must exist
     * @param _matchId id of the match to cancel
     */
    function cancelProposedMatch(uint256 _matchId)
        external
        isAggregator(matches[_matchId].buyer)
        isMatchPending(_matchId)
    {
        cleanupAfterMatchRemoval(_matchId);
        emit MatchCancelled(_matchId);
    }

    /**
     * @notice Accept a previously proposed match
     * @dev Only the buyer can perform this operation
     * @dev The match must exist
     * @param _matchId id of the match to accept
     */
    function acceptMatch(uint256 _matchId) external isMatchPending(_matchId) {
        require(
            matches[_matchId].buyer == msg.sender,
            "Only the buyer can accept the match"
        );
        matches[_matchId].isAccepted = true;
        emit MatchAccepted(_matchId);
    }

    /**
     * @notice Reject a previously proposed match
     * @dev Only the buyer can perform this operation
     * @dev The match must exist
     * @param _matchId id of the match to reject
     */
    function rejectMatch(uint256 _matchId) external isMatchPending(_matchId) {
        require(
            matches[_matchId].buyer == msg.sender ||
                _identityManager.identityOwner(matches[_matchId].asset) ==
                msg.sender,
            "The operation can be performed only by the buyer or the asset owner"
        );
        cleanupAfterMatchRemoval(_matchId);
        emit MatchRejected(_matchId);
    }

    /**
     * @notice Delete a previously accepted match
     * @dev Both the buyer and the asset owner can perform this operation
     * @dev The match must exist and be accepted
     * @param _matchId id of the match to delete
     */
    function deleteMatch(uint256 _matchId) external isMatchAccepted(_matchId) {
        require(
            matches[_matchId].buyer == msg.sender ||
                _identityManager.identityOwner(matches[_matchId].asset) ==
                msg.sender,
            "The operation can be performed only by the buyer or the asset owner"
        );
        cleanupAfterMatchRemoval(_matchId);
        emit MatchDeleted(_matchId);
    }
}
