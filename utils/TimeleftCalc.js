const calculateTimeLeft = (createdAtTime) => {
    const now = new Date(); //4 5
    const deadline = new Date(createdAtTime); //4
    deadline.setDate(deadline.getDate() + 7); // 11

    if(now > deadline) {
        return 'Task has expired!'
    }

    const timeDifference = deadline - now;

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    // Format the result
    const formattedTime = `${days}d:${hours}h:${minutes}m:${seconds}s`;
    return formattedTime;
}
module.exports = calculateTimeLeft