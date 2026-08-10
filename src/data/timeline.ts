
import type { TimelineItem } from '../../types';
import timelineJson from './timeline.json';

function extractYear(date: string): number {
  const match = date.match(/\d{4}/);
  return match ? parseInt(match[0], 10) : 0;
}

const timelineData: TimelineItem[] = [...(timelineJson as TimelineItem[])].sort((a, b) => {
  const yearDiff = extractYear(a.date) - extractYear(b.date);
  if (yearDiff !== 0) return yearDiff;
  return a.order - b.order;
});

export default timelineData;
