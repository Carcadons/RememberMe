import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import { PersonCard, QuickFact, Note } from '../types';
import { encryptData, decryptData } from '../utils/encryption';

const DB_NAME = 'RememberMe.db';

class Database {
  private db: SQLite.SQLiteDatabase | null = null;
  private encryptionKey: string | null = null;

  async init(encryptionKey: string): Promise<void> {
    this.encryptionKey = encryptionKey;
    this.db = await SQLite.openDatabaseAsync(DB_NAME);

    await this.createTables();
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS person_cards (
        id TEXT PRIMARY KEY,
        fullName TEXT NOT NULL,
        preferredName TEXT,
        title TEXT,
        company TEXT,
        photoURI TEXT,
        oneLineContext TEXT,
        lastMet TEXT,
        linkedContacts TEXT,
        privacy TEXT,
        starred INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS quick_facts (
        id TEXT PRIMARY KEY,
        personId TEXT,
        label TEXT,
        value TEXT,
        icon TEXT,
        FOREIGN KEY (personId) REFERENCES person_cards (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        personId TEXT,
        date TEXT NOT NULL,
        shortNote TEXT NOT NULL,
        meetingContext TEXT,
        FOREIGN KEY (personId) REFERENCES person_cards (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS tags (
        id TEXT PRIMARY KEY,
        personId TEXT,
        tag TEXT,
        FOREIGN KEY (personId) REFERENCES person_cards (id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_person_name ON person_cards (fullName);
      CREATE INDEX IF NOT EXISTS idx_person_starred ON person_cards (starred);
    `);
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

    await this.db.runAsync(
      `INSERT INTO person_cards (
        id, fullName, preferredName, title, company, photoURI,
        oneLineContext, lastMet, linkedContacts, privacy, starred,
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      person.id,
      this.encryptField(person.fullName),
      person.preferredName ? this.encryptField(person.preferredName) : null,
      person.title ? this.encryptField(person.title) : null,
      person.company ? this.encryptField(person.company) : null,
      person.photoURI || null,
      person.oneLineContext ? this.encryptField(person.oneLineContext) : null,
      person.lastMet ? person.lastMet.toISOString() : null,
      this.encryptField(person.linkedContacts),
      this.encryptField(person.privacy),
      person.starred ? 1 : 0,
      person.createdAt.toISOString(),
      person.updatedAt.toISOString()
    );

    // Add quick facts
    for (const fact of person.quickFacts) {
      await this.db.runAsync(
        `INSERT INTO quick_facts (id, personId, label, value, icon) VALUES (?, ?, ?, ?, ?)`,
        fact.id,
        person.id,
        this.encryptField(fact.label),
        this.encryptField(fact.value),
        fact.icon || null
      );
    }

    // Add notes
    for (const note of person.notes) {
      await this.db.runAsync(
        `INSERT INTO notes (id, personId, date, shortNote, meetingContext) VALUES (?, ?, ?, ?, ?)`,
        note.id,
        person.id,
        note.date.toISOString(),
        this.encryptField(note.shortNote),
        note.meetingContext ? this.encryptField(note.meetingContext) : null
      );
    }

    // Add tags
    for (const tag of person.tags) {
      await this.db.runAsync(
        `INSERT INTO tags (id, personId, tag) VALUES (?, ?, ?)`,
        `${person.id}-${tag}`,
        person.id,
        this.encryptField(tag)
      );
    }
  }

  async updatePerson(person: PersonCard): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.runAsync(
      `UPDATE person_cards SET
        fullName = ?, preferredName = ?, title = ?, company = ?,
        photoURI = ?, oneLineContext = ?, lastMet = ?, linkedContacts = ?,
        privacy = ?, starred = ?, updatedAt = ?
      WHERE id = ?`,
      this.encryptField(person.fullName),
      person.preferredName ? this.encryptField(person.preferredName) : null,
      person.title ? this.encryptField(person.title) : null,
      person.company ? this.encryptField(person.company) : null,
      person.photoURI || null,
      person.oneLineContext ? this.encryptField(person.oneLineContext) : null,
      person.lastMet ? person.lastMet.toISOString() : null,
      this.encryptField(person.linkedContacts),
      this.encryptField(person.privacy),
      person.starred ? 1 : 0,
      new Date().toISOString(),
      person.id
    );

    if (result.changes === 0) {
      throw new Error('Person not found');
    }

    // Delete and re-add quick facts
    await this.db.runAsync(`DELETE FROM quick_facts WHERE personId = ?`, person.id);
    for (const fact of person.quickFacts) {
      await this.db.runAsync(
        `INSERT INTO quick_facts (id, personId, label, value, icon) VALUES (?, ?, ?, ?, ?)`,
        fact.id,
        person.id,
        this.encryptField(fact.label),
        this.encryptField(fact.value),
        fact.icon || null
      );
    }

    // Delete and re-add tags
    await this.db.runAsync(`DELETE FROM tags WHERE personId = ?`, person.id);
    for (const tag of person.tags) {
      await this.db.runAsync(
        `INSERT INTO tags (id, personId, tag) VALUES (?, ?, ?)`,
        `${person.id}-${tag}`,
        person.id,
        this.encryptField(tag)
      );
    }
  }

  async getPerson(id: string): Promise<PersonCard | null> {
    if (!this.db) throw new Error('Database not initialized');

    const personRow: any = await this.db.getFirstAsync(
      `SELECT * FROM person_cards WHERE id = ?`,
      id
    );

    if (!personRow) return null;

    return this.parsePerson(personRow);
  }

  async getAllPeople(limit?: number): Promise<PersonCard[]> {
    if (!this.db) throw new Error('Database not initialized');

    const query = limit
      ? `SELECT * FROM person_cards ORDER BY updatedAt DESC LIMIT ?`
      : `SELECT * FROM person_cards ORDER BY updatedAt DESC`;

    const rows: any[] = limit
      ? await this.db.getAllAsync(query, limit)
      : await this.db.getAllAsync(query);

    const people = await Promise.all(rows.map(row => this.parsePerson(row)));
    return people;
  }

  async getStarredPeople(): Promise<PersonCard[]> {
    if (!this.db) throw new Error('Database not initialized');

    const rows: any[] = await this.db.getAllAsync(
      `SELECT * FROM person_cards WHERE starred = 1 ORDER BY updatedAt DESC`
    );

    const people = await Promise.all(rows.map(row => this.parsePerson(row)));
    return people;
  }

  async searchPeople(query: string): Promise<PersonCard[]> {
    if (!this.db) throw new Error('Database not initialized');

    // This is a simplified search - in production you'd use FTS or fuzzy search
    const rows: any[] = await this.db.getAllAsync(
      `SELECT * FROM person_cards WHERE fullName LIKE ? ORDER BY updatedAt DESC`,
      `%${query}%`
    );

    const people = await Promise.all(rows.map(row => this.parsePerson(row)));
    return people;
  }

  async deletePerson(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(`DELETE FROM person_cards WHERE id = ?`, id);
  }

  async addNote(personId: string, note: Note): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      `INSERT INTO notes (id, personId, date, shortNote, meetingContext) VALUES (?, ?, ?, ?, ?)`,
      note.id,
      personId,
      note.date.toISOString(),
      this.encryptField(note.shortNote),
      note.meetingContext ? this.encryptField(note.meetingContext) : null
    );
  }

  async getNotes(personId: string): Promise<Note[]> {
    if (!this.db) throw new Error('Database not initialized');

    const rows: any[] = await this.db.getAllAsync(
      `SELECT * FROM notes WHERE personId = ? ORDER BY date DESC`,
      personId
    );

    return rows.map(row => ({
      id: row.id,
      date: new Date(row.date),
      shortNote: this.decryptField(row.shortNote),
      meetingContext: row.meetingContext ? this.decryptField(row.meetingContext) : undefined
    }));
  }

  private async parsePerson(row: any): Promise<PersonCard> {
    if (!this.db) throw new Error('Database not initialized');

    const quickFacts: QuickFact[] = [];
    const quickFactRows: any[] = await this.db.getAllAsync(
      `SELECT * FROM quick_facts WHERE personId = ?`,
      row.id
    );

    for (const factRow of quickFactRows) {
      quickFacts.push({
        id: factRow.id,
        label: this.decryptField(factRow.label),
        value: this.decryptField(factRow.value),
        icon: factRow.icon
      });
    }

    const tagRows: any[] = await this.db.getAllAsync(
      `SELECT * FROM tags WHERE personId = ?`,
      row.id
    );

    const tags = tagRows.map(tagRow => this.decryptField(tagRow.tag));

    return {
      id: row.id,
      fullName: this.decryptField(row.fullName),
      preferredName: row.preferredName ? this.decryptField(row.preferredName) : undefined,
      title: row.title ? this.decryptField(row.title) : undefined,
      company: row.company ? this.decryptField(row.company) : undefined,
      photoURI: row.photoURI,
      oneLineContext: row.oneLineContext ? this.decryptField(row.oneLineContext) : undefined,
      quickFacts,
      tags,
      lastMet: row.lastMet ? new Date(row.lastMet) : undefined,
      notes: [], // Notes loaded separately
      linkedContacts: this.decryptField(row.linkedContacts),
      privacy: this.decryptField(row.privacy),
      starred: row.starred === 1,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };
  }
}

export const database = new Database();
