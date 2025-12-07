import { saveLead } from '../src/services/excelService';

async function test() {
    console.log('Testing saveLead...');
    await saveLead({
        name: 'Test User',
        phone: '+1234567890',
        interest: 'buying',
        budget: '$500k',
        language: 'en'
    });
    console.log('Done.');
}

test();
