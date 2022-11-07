// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment the line to use openzeppelin/ERC20
// You can use this dependency directly because it has been installed already


// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "./StudentERC20.sol";
contract StudentSocietyDAO {

    // use a event if you want
    event ProposalInitiated(uint32 proposalIndex);
    //
    uint256 constant public VOTE_AMOUNT = 10;   //投票积分
    struct Vote {
        address voter;  //投票地址
        uint count;  // 投票次数
        uint index;   // 投票提案的索引
    }
    Vote[] votes;
    uint256 constant public PROPOSAL_AMOUNT = 10;   //提案积分

    struct Proposer{
        address proposer;
        uint count;
    }
    Proposer[] proposers;

    struct Proposal {
        uint32 index;      // index of this proposal
        address proposer;  // who make this proposal
        uint256 startTime; // proposal start time
        uint256 duration;  // proposal duration
        string name;       // proposal name
        string data;
        uint agree;
        uint disagree;
        bool end;
        bool success;
    }

    StudentERC20 public studentERC20;
    //mapping(uint32 => Proposal) proposals; // A map from proposal index to proposal
    Proposal[] proposals;


    constructor() {
        // maybe you need a constructor
        studentERC20 = new StudentERC20("ZJUToken", "ZJUTokenSymbol");
        Proposal memory temp;
        temp.index = (uint32)(proposals.length);
        temp.proposer = msg.sender;
        temp.startTime = block.timestamp;
        temp.duration = 10;
        temp.name = "test";
        temp.data = "data";
        temp.agree = 0;
        temp.disagree = 0;
        temp.end = false;
        temp.success = false;
        proposals.push(temp);
    }
    
    //vote
    function VoteProposal(uint index ,uint choice) public{
        uint i=0;
        require((proposals.length > index) && proposals[index].end == false, "No proposals!");
        for(i = 0; i < votes.length; i++){
            if(votes[i].voter == msg.sender && votes[i].index == index){
                require(votes[i].count < 3, "vote too many times!");
                votes[i].count++;
                break;
            }
        }
        if(i == votes.length){
                Vote memory temp;
                temp.index = index;
                temp.count = 1;
                temp.voter = msg.sender;
                votes.push(temp);
        }

        if(choice == 0){
            proposals[index].agree++;
        }else{
            proposals[index].disagree++;
        }
        
        studentERC20.transferFrom(msg.sender, address(this), VOTE_AMOUNT);
    }
    
    //proposal
    function BeginProposal(uint256 duration, string memory name, string memory data) public {
        // 委托转账操作
        studentERC20.transferFrom(msg.sender, address(this), PROPOSAL_AMOUNT);
        // 
        Proposal memory temp;
        temp.index = (uint32)(proposals.length);
        temp.proposer = msg.sender;
        temp.startTime = block.timestamp;
        temp.duration = duration;
        temp.name = name;
        temp.data = data;
        temp.agree = 0;
        temp.disagree = 0;
        temp.end = false;
        temp.success = false;
        proposals.push(temp);

        uint i;
        for(i=0; i<proposers.length; i++){
            if(proposers[i].proposer == msg.sender){
                break;
            }
        }
        if(i == proposers.length){
            Proposer memory tem;
            tem.proposer = msg.sender;
            tem.count = 0;
            proposers.push(tem);
        }

    }

    function CheckProposal() public{
        for(uint256 i = 0; i < proposals.length; i++){
            if(proposals[i].startTime+proposals[i].duration < block.timestamp && proposals[i].end == false){
                proposals[i].end = true;
                if(proposals[i].agree > proposals[i].disagree){
                    proposals[i].success = true;
                    for(uint256 j=0; j<proposers.length; j++){
                        if(proposers[j].proposer == proposals[i].proposer){
                            proposers[j].count++;                           
                            break;
                        }
                    }
                }else{
                    proposals[i].success = false;
                }
            }
        }
    }

    // 获取提案数量
    function getproposalNumber() view external returns (uint256){
        return proposals.length;
    }
    function getProposals() public view returns (Proposal[] memory){
        return proposals;
    }
    function getvoteNumber() view external returns (uint256){
        return votes.length;
    }
    function getVotes() public view returns (Vote[] memory){
        return votes;
    }
    
    function getcountnumber(address input) public view returns (uint){
        uint i;
        uint count = 0;
        for(i=0;i<proposers.length;i++){
            if(proposers[i].proposer == input){
                count = proposers[i].count;
                break;
            }
        }
        return count;
    }
    function getProposer() public view returns (Proposer[] memory){
        return proposers;
    }
    function helloworld() pure external returns(string memory) {
        return "hello world";
    }

    // ...
    // TODO add any logic if you want
}
