function contestObjectMapper(contestArray) {
 let contestObjectArray = [];

 for (let i = 0; i < contestArray.length; i++) {
  let contest = contestArray[i];
  if (contest.length < 7) return null;
  const contestObject = {
   title: contest[0],
   participants: contest[1]?.map((participant) => participant.toNumber()),
   requestParticipants: contest[2]?.map((participant) =>
    participant.toNumber()
   ),
   totalVotes: contest[3]?.toNumber(),
   hasVoted: contest[4]?.map((participant) => participant.toNumber()),
   participantsVotes: contest[5]?.map((votes) => votes.toNumber()),
   isContestStarted: contest[6],
   isContestEnded: contest[7],
  };
  contestObjectArray.push(contestObject);
 }

 return contestObjectArray;
}
function userObjectMapper(user) {
 if (user.length < 9) return null;
 return {
  firstName: user[0],
  lastName: user[1],
  userID: user[2]?.toNumber(),
  age: user[3]?.toNumber(),
  address: user[4],
  gender: user[5],
  email: user[6],
  imageUrl: user[8],
  voterConstituency: user[9],
 };
}

module.exports = { contestObjectMapper, userObjectMapper };
