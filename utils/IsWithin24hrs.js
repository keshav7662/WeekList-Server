const isWithin24Hours = (createdAt) => {
    const currentTime = new Date();
    const createdTime = new Date(createdAt);
    const timeDifference = currentTime - createdTime;
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    return hoursDifference <= 24;
};
module.exports = isWithin24Hours