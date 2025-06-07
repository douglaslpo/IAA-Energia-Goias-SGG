import { DateRange } from '../types';

export const getDaysDifference = (timeRange: DateRange): number => {
    return Math.ceil(
        (timeRange.endDate.getTime() - timeRange.startDate.getTime()) / 
        (1000 * 60 * 60 * 24)
    );
}; 