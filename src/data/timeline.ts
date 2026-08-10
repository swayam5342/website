
import type { TimelineItem } from '../../types';
import timelineJson from './timeline.json';
const timelineData: TimelineItem[] = [...(timelineJson as TimelineItem[])].sort((a, b) => a.order - b.order);

export default timelineData;
