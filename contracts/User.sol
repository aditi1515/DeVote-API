// SPDX-License-Identifier: MIT
pragma solidity >0.8.10;

contract Users {
    struct User {
        string firstname;
        string lastname;
        uint UserID;
        uint256 age;
        string houseaddress;
        string gender;
        string email;
        string aadhaarNumber;
        string imageUrl;
        string voterConstituency;
        address userAddress;
    }

    mapping(uint => string) private UserIDToPassword;

    User[] private users;

    function signUp(
        string memory firstname,
        string memory lastname,
        uint UserID,
        uint256 age,
        string memory password,
        string memory houseaddress,
        string memory gender,
        string memory email,
        string memory aadhaarNumber,
        string memory imageUrl,
        string memory voterConstituency
    ) public {
        if (checkForValidSignUp(UserID)) {
            require(false, "Not allowed");
        }

        User memory user = User(
            firstname,
            lastname,
            UserID,
            age,
            houseaddress,
            gender,
            email,
            aadhaarNumber,
            imageUrl,
            voterConstituency,
            msg.sender
        );
        users.push(user);
        UserIDToPassword[UserID] = password;
    }

    function checkForValidSignUp(uint UserID) public view returns (bool) {
        for (uint i = 0; i < users.length; i++) {
            if (users[i].UserID == UserID) {
                return true; // Found a match
            }
        }

        // more checks in future

        return false;
    }

    function getMap(uint UserID) public view returns (string memory) {
        return UserIDToPassword[UserID];
    }

    function login(
        uint UserID,
        string memory password
    ) public view returns (User memory) {
        if (
            keccak256(bytes(UserIDToPassword[UserID])) ==
            keccak256(bytes(password))
        ) {
            for (uint i = 0; i < users.length; i++) {
                if (users[i].UserID == UserID) {
                    return users[i];
                }
            }
        }
        revert("User not found or password is incorrect");
    }

    function getUser(uint UserID) public view returns (User memory) {
        for (uint i = 0; i < users.length; i++) {
            if (users[i].UserID == UserID) {
                return users[i];
            }
        }

        revert("User not found");
    }

    function getUsers() public view returns (User[] memory) {
        return users;
    }
}
