import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import fs from 'fs';

const csvPath = path.join(__dirname, '../../leads.csv');

interface CsvHeader {
    id: string;
    title: string;
}

const csvHeaders: CsvHeader[] = [
    { id: 'timestamp', title: 'TIMESTAMP' },
    { id: 'name', title: 'NAME' },
    { id: 'phone', title: 'PHONE' },
    { id: 'interest', title: 'INTEREST' },
    { id: 'budget', title: 'BUDGET' },
    { id: 'language', title: 'LANGUAGE' },
];

/**
 * Initialize CSV file with headers if it doesn't exist
 * @returns true if file exists or was created successfully, false otherwise
 */
function initializeCsvFile(): boolean {
    if (!fs.existsSync(csvPath)) {
        try {
            const headers = csvHeaders.map(h => h.title).join(',');
            fs.writeFileSync(csvPath, headers + '\n');
            console.log('Initialized leads.csv with headers');
            return true;
        } catch (error) {
            console.error('Error initializing CSV file:', error);
            return false;
        }
    }
    return true;
}

// Initialize on module load
initializeCsvFile();

const csvWriter = createObjectCsvWriter({
    path: csvPath,
    header: csvHeaders,
    append: true,
});

export interface LeadData {
    name: string;
    phone?: string;
    interest: string;
    budget: string;
    language: string;
}

interface LeadRecord extends LeadData {
    timestamp: string;
}

export async function saveLead(data: LeadData): Promise<void> {
    try {
        const record: LeadRecord = {
            timestamp: new Date().toISOString(),
            name: data.name || '',
            phone: data.phone || '',
            interest: data.interest || '',
            budget: data.budget || '',
            language: data.language || '',
        };
        
        await csvWriter.writeRecords([record]);
        console.log('Lead saved:', record);
    } catch (error) {
        console.error('Error saving lead:', error);
        throw error;
    }
}

export async function getLeadsCount(): Promise<number> {
    try {
        if (!fs.existsSync(csvPath)) {
            return 0;
        }
        const content = fs.readFileSync(csvPath, 'utf-8');
        const lines = content.split('\n').filter(line => line.trim() !== '');
        return Math.max(0, lines.length - 1); // Subtract header row
    } catch (error) {
        console.error('Error counting leads:', error);
        return 0;
    }
}
