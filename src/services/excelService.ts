import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import fs from 'fs';

const csvPath = path.join(__dirname, '../../leads.csv');

// Ensure the file exists with headers
if (!fs.existsSync(csvPath)) {
    const writer = createObjectCsvWriter({
        path: csvPath,
        header: [
            { id: 'timestamp', title: 'TIMESTAMP' },
            { id: 'name', title: 'NAME' },
            { id: 'phone', title: 'PHONE' },
            { id: 'interest', title: 'INTEREST' },
            { id: 'budget', title: 'BUDGET' },
            { id: 'language', title: 'LANGUAGE' },
        ],
    });
    // Write empty file to initialize headers? No, csv-writer handles it if we write records.
    // But to be safe let's just leave it.
}

const csvWriter = createObjectCsvWriter({
    path: csvPath,
    header: [
        { id: 'timestamp', title: 'TIMESTAMP' },
        { id: 'name', title: 'NAME' },
        { id: 'phone', title: 'PHONE' },
        { id: 'interest', title: 'INTEREST' },
        { id: 'budget', title: 'BUDGET' },
        { id: 'language', title: 'LANGUAGE' },
    ],
    append: true,
});

export interface LeadData {
    name: string;
    phone: string;
    interest: string;
    budget: string;
    language: string;
}

export async function saveLead(data: LeadData) {
    const record = {
        ...data,
        timestamp: new Date().toISOString(),
    };
    await csvWriter.writeRecords([record]);
    console.log('Lead saved:', record);
}
