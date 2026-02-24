import Dexie, { type EntityTable } from 'dexie';

export interface MeetingRecord {
    id?: number;
    date: string; // ISO String
    transcript: string;
    summary: string;
    actionItems: string[];
    source?: string;
}

// Create a new local database named "MeetingAssistantDB"
const db = new Dexie('MeetingAssistantDB') as Dexie & {
    meetings: EntityTable<
        MeetingRecord,
        'id' // primary key "id" (for the typings only)
    >;
};

// Schema declaration
db.version(1).stores({
    meetings: '++id, date' // Primary key and indexed props
});

export { db };
