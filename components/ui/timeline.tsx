import React from "react";

export interface TimelineProps {
  children: React.ReactNode;
}

export function Timeline({ children }: TimelineProps) {
  return (
    <ul className="timeline timeline-vertical max-md:timeline-compact">
      {children}
    </ul>
  );
}

export interface TimelineItemProps {
  start?: React.ReactNode;
  end?: React.ReactNode;
  icon?: React.ReactNode;
  isFirst?: boolean;
  isLast?: boolean;
}

export function TimelineItem({ start, end, icon, isFirst, isLast }: TimelineItemProps) {
  return (
    <li>
      {!isFirst && <hr className="bg-orange-200" />}
      {start && <div className="timeline-start md:text-end mb-10">{start}</div>}
      <div className="timeline-middle text-orange-500">
        {icon || (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      {end && <div className="timeline-end mb-10">{end}</div>}
      {!isLast && <hr className="bg-orange-200" />}
    </li>
  );
}
