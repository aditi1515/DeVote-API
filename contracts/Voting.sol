// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Contest {
        string title;
        uint[] participants;
        uint[] requestParticipants;
        uint totalVotes;
        uint[] hasVoted;
        uint[] participantsVotes;
        bool isContestStarted;
        bool isContestEnded;
    }

    Contest[] public contests;
    uint[] public ownersByUserID;
    address private owner;

    constructor() payable {
        owner = msg.sender;
    }

    modifier onlyOwner(uint newOwnerUserID) {
        if(msg.sender != owner) {
            bool isContractOwner = false;
        for (uint i = 0; i < ownersByUserID.length; i++) {
            if (
                ownersByUserID[i] ==newOwnerUserID
            ) {
                isContractOwner = true;
                break;
            }
        }
        require(isContractOwner, "You are not allowed to perform this action");
        }
        
        _;
    }

    function createContest(
        string memory title,
        uint[] memory participants,
        uint newOwnerUserID
    ) public payable onlyOwner(newOwnerUserID) {
        contests.push(
            Contest(
                title,
                participants,
                new uint[](0),
                0,
                new uint[](0),
                new uint[](participants.length),
                false,
                false
            )
        );
    }

    function isOwner(uint newOwnerUserID) public view returns (bool) {
        bool isContractOwner = false;
        for (uint i = 0; i < ownersByUserID.length; i++) {
            if (
                ownersByUserID[i] == newOwnerUserID
            ) {
                isContractOwner = true;
                break;
            }
        }

        return isContractOwner;
    }

    function startContest(
        uint contestIdx,
        uint newOwnerUserID
    ) public onlyOwner(newOwnerUserID) {
        require(contestIdx < contests.length, "Invalid contest index");
        contests[contestIdx].participantsVotes = new uint[](contests[contestIdx].participants.length);
        contests[contestIdx].isContestStarted = true;
    }

    function endContest(
        uint contestIdx,
        uint newOwnerUserID
    ) public onlyOwner(newOwnerUserID) {
        require(contestIdx < contests.length, "Invalid contest index");
        contests[contestIdx].isContestEnded = true;
    }

    function vote(uint contestIdx,  uint participantUserID , uint UserID) public {
        require(contestIdx < contests.length, "Invalid contest index");
        Contest storage contest = contests[contestIdx];
        require(contest.isContestStarted, "Contest not started yet!!!");
        uint sender = UserID;

        // Check if the sender has already voted
        for (uint i = 0; i < contest.hasVoted.length; i++) {
            require(contest.hasVoted[i] != UserID, "You have already voted");
        }

        bool isParticipant = false;

        for (uint i = 0; i < contest.participants.length; i++) {
            if (participantUserID == contest.participants[i]) {
                isParticipant = true;
                contest.participantsVotes[i] += 1; // Increment the vote count for the participant at index i
                contest.hasVoted.push(sender);
                contest.totalVotes += 1;
                break;
            }
        }

        require(isParticipant, "Participant does not exist in this contest");
    }

    function addToOwners(
       uint newOwnerUserID
    ) public onlyOwner(newOwnerUserID) {
        // Check if the new owner is not already in the owners array
        for (uint i = 0; i < ownersByUserID.length; i++) {
            require(
                ownersByUserID[i] ==
                   newOwnerUserID,
                "Owner already exists"
            );
        }
        ownersByUserID.push(newOwnerUserID);
    }

    function addParticipant(uint contestIdx, uint  participantUserID , uint userID) public onlyOwner(userID) {
        require(contestIdx < contests.length, "Invalid contest index");
         require(contests[contestIdx].isContestStarted == false,"contest already started");
        Contest storage contest = contests[contestIdx];
        for (uint i = 0; i < contest.participants.length; i++) {
            if (contest.participants[i] == participantUserID)
                revert("already present");
        }
        contest.participants.push(participantUserID);
    }

    function addRequestParticipant(
        uint contestIdx,
        uint participantUserID
    ) public {
        require(contestIdx < contests.length, "Invalid contest index");
        require(contests[contestIdx].isContestStarted == false,"contest already started");
        Contest storage contest = contests[contestIdx];
        for (uint i = 0; i < contest.requestParticipants.length; i++) {
            if (contest.requestParticipants[i] == participantUserID)
                revert("already present request");
        }
        contest.requestParticipants.push(participantUserID);
    }

    function getAllContests() public view returns (Contest[] memory) {
        return contests;
    }
}
