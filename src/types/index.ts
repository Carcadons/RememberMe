export interface PersonCard {
  id: string;
  fullName: string;
  preferredName?: string;
  title?: string;
  company?: string;
  photoURI?: string;
  oneLineContext?: string;
  quickFacts: QuickFact[];
  tags: string[];
  lastMet?: Date;
  notes: Note[];
  linkedContacts: LinkedContacts;
  privacy: PrivacySettings;
  starred?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuickFact {
  id: string;
  label: string;
  value: string;
  icon?: string;
}

export interface Note {
  id: string;
  date: Date;
  shortNote: string;
  meetingContext?: string;
}

export interface LinkedContacts {
  phone?: string;
  email?: string;
  linkedinURL?: string;
}

export interface PrivacySettings {
  sharedWith: string[];
  consentGiven: boolean;
  consentDate?: Date;
}

export interface Meeting {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  attendees: string[];
  personCardId?: string;
}

export interface SearchResult {
  person: PersonCard;
  relevance: number;
}

export type SortOption = 'recent' | 'alphabetical' | 'starred';
