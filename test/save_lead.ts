import { saveLead, getLeadsCount } from '../src/services/excelService';

async function test() {
    console.log('Testing saveLead...');
    
    const initialCount = await getLeadsCount();
    console.log(`Initial leads count: ${initialCount}`);
    
    await saveLead({
        name: 'Test User',
        phone: '+1234567890',
        interest: 'buying',
        budget: '$500k',
        language: 'en'
    });
    
    const newCount = await getLeadsCount();
    console.log(`New leads count: ${newCount}`);
    
    if (newCount === initialCount + 1) {
        console.log('Test passed!');
    } else {
        console.log('Test failed!');
        process.exit(1);
    }
    
    console.log('Done.');
}

test().catch((error) => {
    console.error('Test error:', error);
    process.exit(1);
});
