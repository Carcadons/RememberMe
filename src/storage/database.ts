import { openDB, IDBPDatabase, DBSchema } from 'idb';
import { PersonCard, QuickFact, Note } from '../types';
import { encryptData, decryptData } from '../utils/encryption';

// Database schema for IndexedDB
interface RememberMeDB extends DBSchema {
  person_cards: {
    key: string;
    value: {
      id: string;
      fullName_encrypted: string;
      preferredName_encrypted: string | null;
      title_encrypted: string | null;
      company_encrypted: string | null;
      photoURI: string | null;
      oneLineContext_encrypted: string | null;
      lastMet: string | null;
      linkedContacts_encrypted: string;
      privacy_encrypted: string;
      starred: number;
      createdAt: string;
      updatedAt: string;
    };
    indexes: {
      'by-starred': number;
      'by-updated': string;
    };
  };
  quick_facts: {
    key: string;
    value: {
      id: string;
      personId: string;
      label_encrypted: string;
      value_encrypted: string;
      icon: string | null;
    };
    indexes: {
      'by-person': string;
    };
  };
  notes: {
    key: string;
    value: {
      id: string;
      personId: string;
      date: string;
      shortNote_encrypted: string;
      meetingContext_encrypted: string | null;
    };
    indexes: {
      'by-person': string;
      'by-date': string;
    };
  };
  tags: {
    key: string;
    value: {
      id: string;
      personId: string;
      tag_encrypted: string;
    };
    indexes: {
      'by-person': string;
    };
  };
}

class Database {
  private db: IDBPDatabase<RememberMeDB> | null = null;
  private encryptionKey: string | null = null;

  async init(encryptionKey: string): Promise<void> {
    this.encryptionKey = encryptionKey;
    this.db = await openDB<RememberMeDB>('RememberMe-DB', 1, {
      upgrade(db) {
        // Person cards store
        const personStore = db.createObjectStore('person_cards', { keyPath: 'id' });
        personStore.createIndex('by-starred', 'starred');
        personStore.createIndex('by-updated', 'updatedAt');

        // Quick facts store
        const factsStore = db.createObjectStore('quick_facts', { keyPath: 'id' });
        factsStore.createIndex('by-person', 'personId');

        // Notes store
        const notesStore = db.createObjectStore('notes', { keyPath: 'id' });
        notesStore.createIndex('by-person', 'personId');
        notesStore.createIndex('by-date', 'date');

        // Tags store
        const tagsStore = db.createObjectStore('tags', { keyPath: 'id' });
        tagsStore.createIndex('by-person', 'personId');
      },
    });
  }

  private encryptField(data: any): string {
    if (!this.encryptionKey) throw new Error('Encryption key not set');
    if (!data) return '';
    return encryptData(JSON.stringify(data), this.encryptionKey);
  }

  private decryptField(encryptedData: string): any {
    if (!this.encryptionKey) throw new Error('Encryption key not set');
    if (!encryptedData) return null;
    const decrypted = decryptData(encryptedData, this.encryptionKey);
    return JSON.parse(decrypted);
  }

  async addPerson(person: PersonCard): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const tx = this.db.transaction(['person_cards', 'quick_facts', 'notes', 'tags'], 'readwrite');

    await tx.objectStore('person_cards').add({
      id: person.id,
      fullName_encrypted: this.encryptField(person.fullName),
      preferredName_encrypted: person.preferredName ? this.encryptField(person.preferredName) : null,
      title_encrypted: person.title ? this.encryptField(person.title) : null,
      company_encrypted: person.company ? this.encryptField(person.company) : null,
      photoURI: person.photoURI || null,
      oneLineContext_encrypted: person.oneLineContext ? this.encryptField(person.oneLineContext) : null,
      lastMet: person.lastMet ? person.lastMet.toISOString() : null,
      linkedContacts_encrypted: this.encryptField(person.linkedContacts),
      privacy_encrypted: this.encryptField(person.privacy),
      starred: person.starred ? 1 : 0,
      createdAt: person.createdAt.toISOString(),
      updatedAt: person.updatedAt.toISOString(),
    });

    // Add quick facts
    for (const fact of person.quickFacts) {
      await tx.objectStore('quick_facts').add({
        id: fact.id,
        personId: person.id,
        label_encrypted: this.encryptField(fact.label),
        value_encrypted: this.encryptField(fact.value),
        icon: fact.icon || null,
      });
    }

    // Add notes
    for (const note of person.notes) {
      await tx.objectStore('notes').add({
        id: note.id,
        personId: person.id,
        date: note.date.toISOString(),
        shortNote_encrypted: this.encryptField(note.shortNote),
        meetingContext_encrypted: note.meetingContext ? this.encryptField(note.meetingContext) : null,
      });
    }

    // Add tags
    for (const tag of person.tags) {
      await tx.objectStore('tags').add({
        id: `${person.id}-${tag}`,
        personId: person.id,
        tag_encrypted: this.encryptField(tag),
      });
    }

    await tx.done;
  }

  async updatePerson(person: PersonCard): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const tx = this.db.transaction(['person_cards', 'quick_facts', 'tags'], 'readwrite');

    await tx.objectStore('person_cards').put({
      id: person.id,
      fullName_encrypted: this.encryptField(person.fullName),
      preferredName_encrypted: person.preferredName ? this.encryptField(person.preferredName) : null,
      title_encrypted: person.title ? this.encryptField(person.title) : null,
      company_encrypted: person.company ? this.encryptField(person.company) : null,
      photoURI: person.photoURI || null,
      oneLineContext_encrypted: person.oneLineContext ? this.encryptField(person.oneLineContext) : null,
      lastMet: person.lastMet ? person.lastMet.toISOString() : null,
      linkedContacts_encrypted: this.encryptField(person.linkedContacts),
      privacy_encrypted: this.encryptField(person.privacy),
      starred: person.starred ? 1 : 0,
      createdAt: person.createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Delete and re-add quick facts
    await tx.objectStore('quick_facts').delete(IDBKeyRange.bound(`${person.id}-`, `${person.id}-z`));
    for (const fact of person.quickFacts) {
      await tx.objectStore('quick_facts').add({
        id: fact.id,
        personId: person.id,
        label_encrypted: this.encryptField(fact.label),
        value_encrypted: this.encryptField(fact.value),
        icon: fact.icon || null,
      });
    }

    // Delete and re-add tags
    await tx.objectStore('tags').delete(IDBKeyRange.bound(`${person.id}-`, `${person.id}-z`));
    for (const tag of person.tags) {
      await tx.objectStore('tags').add({
        id: `${person.id}-${tag}`,
        personId: person.id,
        tag_encrypted: this.encryptField(tag),
      });
    }

    await tx.done;
  }

  async getPerson(id: string): Promise<PersonCard | null> {
    if (!this.db) throw new Error('Database not initialized');

    const personRow = await this.db.get('person_cards', id);
    if (!personRow) return null;

    return this.parsePerson(personRow);
  }

  async getAllPeople(limit?: number): Promise<PersonCard[]> {
    if (!this.db) throw new Error('Database not initialized');

    let people: PersonCard[] = [];

    if (limit) {
      const rows = await this.db.getAllFromIndex('person_cards', 'by-updated', null, limit);
      const parsed = await Promise.all(rows.map(row => this.parsePerson(row)));
      people = parsed;
    } else {
      const rows = await this.db.getAll('person_cards');
      const parsed = await Promise.all(rows.map(row => this.parsePerson(row)));
      // Sort by updatedAt descending
      people = parsed.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    }

    return people;
  }

  async getStarredPeople(): Promise<PersonCard[]> {
    if (!this.db) throw new Error('Database not initialized');

    const rows = await this.db.getAllFromIndex('person_cards', 'by-starred', 1);
    const people = await Promise.all(rows.map(row => this.parsePerson(row)));
    return people.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async searchPeople(query: string): Promise<PersonCard[]> {
    if (!this.db) throw new Error('Database not initialized');

    const allPeople = await this.getAllPeople();
    const lowercaseQuery = query.toLowerCase();

    const results = allPeople.filter(person => {
      return (
        person.fullName.toLowerCase().includes(lowercaseQuery) ||
        person.preferredName?.toLowerCase().includes(lowercaseQuery) ||
        person.title?.toLowerCase().includes(lowercaseQuery) ||
        person.company?.toLowerCase().includes(lowercaseQuery) ||
        person.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
        person.quickFacts.some(fact => fact.value.toLowerCase().includes(lowercaseQuery))
      );
    });

    return results;
  }

  async deletePerson(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const tx = this.db.transaction(['person_cards', 'quick_facts', 'notes', 'tags'], 'readwrite');
    await tx.objectStore('person_cards').delete(id);
    await tx.objectStore('quick_facts').delete(IDBKeyRange.bound(`${id}-`, `${id}-z`));
    await tx.objectStore('notes').delete(IDBKeyRange.bound(`${id}-`, `${id}-z`));
    await tx.objectStore('tags').delete(IDBKeyRange.bound(`${id}-`, `${id}-z`));
    await tx.done;
  }

  async addNote(personId: string, note: Note): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.add('notes', {
      id: note.id,
      personId: personId,
      date: note.date.toISOString(),
      shortNote_encrypted: this.encryptField(note.shortNote),
      meetingContext_encrypted: note.meetingContext ? this.encryptField(note.meetingContext) : null,
    });
  }

  async getNotes(personId: string): Promise<Note[]> {
    if (!this.db) throw new Error('Database not initialized');

    const rows = await this.db.getAllFromIndex('notes', 'by-person', personId);
    const notes = rows
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map(row => ({
        id: row.id,
        date: new Date(row.date),
        shortNote: this.decryptField(row.shortNote_encrypted),
        meetingContext: row.meetingContext_encrypted ? this.decryptField(row.meetingContext_encrypted) : undefined,
      }));

    return notes;
  }

  private async parsePerson(row: any): Promise<PersonCard> {
    if (!this.db) throw new Error('Database not initialized');

    const quickFactRows = await this.db.getAllFromIndex('quick_facts', 'by-person', row.id);
    const quickFacts = quickFactRows.map(factRow => ({
      id: factRow.id,
      label: this.decryptField(factRow.label_encrypted),
      value: this.decryptField(factRow.value_encrypted),
      icon: factRow.icon,
    }));

    const tagRows = await this.db.getAllFromIndex('tags', 'by-person', row.id);
    const tags = tagRows.map(tagRow => this.decryptField(tagRow.tag_encrypted));

    return {
      id: row.id,
      fullName: this.decryptField(row.fullName_encrypted),
      preferredName: row.preferredName_encrypted ? this.decryptField(row.preferredName_encrypted) : undefined,
      title: row.title_encrypted ? this.decryptField(row.title_encrypted) : undefined,
      company: row.company_encrypted ? this.decryptField(row.company_encrypted) : undefined,
      photoURI: row.photoURI,
      oneLineContext: row.oneLineContext_encrypted ? this.decryptField(row.oneLineContext_encrypted) : undefined,
      quickFacts,
      tags,
      lastMet: row.lastMet ? new Date(row.lastMet) : undefined,
      notes: [],
      linkedContacts: this.decryptField(row.linkedContacts_encrypted),
      privacy: this.decryptField(row.privacy_encrypted),
      starred: row.starred === 1,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  }
}

export const database = new Database();
