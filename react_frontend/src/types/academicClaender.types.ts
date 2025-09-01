
export type CalendarTypeEnums = "exam" | "holiday" | "event" | "off_day";

export interface CalenderEntries {
  _id?: string;
  title: string;
  description?: string;
  date: string;
  endDate: string;
  venue: string;
  type: CalendarTypeEnums;
  academicYear?: string;
  applicableClassDivisions: string[];
  createdAt?: string;
  updatedAt?: string;
};

export interface SchoolEventTypes {
  _id?: string;
  title: string;
  venue: string
  description: string;
  date: string 
  endDate: string 
  createdAt?: string;
  updatedAt?: string;
  posterUrl: string
  type: "event"
}

export interface SchoolEventForm {
  title: string;
  description: string;
  date: string
  endDate: string
  venue: string;
  posterFile: File | null;
}


export interface OffDayForm {
  title: string
  description: string
  date: string | null
  endDate: string | null
  type: string
  academicYear?: string
  applicableClassDivisions?: string[]
}
