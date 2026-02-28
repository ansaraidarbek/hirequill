export const getDay = (targetDay?: string) => {
    const day = targetDay ? new Date(targetDay).getDay() : new Date().getDay();
    switch (day) {
        case 0:
            return "sunday";
        case 1:
            return "monday";
        case 2:
            return "tuesday";
        case 3:
            return "wednesday";
        case 4:
            return "thursday";
        case 5:
            return "friday";
        case 6:
            return "saturday";
        default:
            return "monday";
    }
};
