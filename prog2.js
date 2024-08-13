const { MongoClient } = require('mongodb'); // Import MongoClient

async function runQueries() {
    const uri = "mongodb://localhost:27017"; // Replace with your connection string
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('usermanaged');
        
        // If Name field is in a different collection, you might need to change collection
        const transactions = db.collection('transactions');
        const customers = db.collection('customers');

        // a. Find any record where Name is Somu
        const recordSomu = await customers.findOne({ Name: 'Somu' });
        console.log('Record with Name Somu:', recordSomu);

        // b. Find any record where Payment.Total is 600
        const payment600 = await transactions.findOne({ 'Payment.Total': 600 });
        console.log('Record with Payment.Total 600:', payment600);

        // c. Find any record where Transaction.price is between 300 and 500
        const priceRange = await transactions.find({ 'Transaction.price': { $gte: 300, $lte: 500 } }).toArray();
        console.log('Records with Transaction.price between 300 and 500:', priceRange);

        // d. Calculate the total transaction amount by adding up Payment.Total in all records
        const totalTransactionAmount = await transactions.aggregate([
            { $group: { _id: null, total: { $sum: '$Payment.Total' } } }
        ]).toArray();
        console.log('Total transaction amount:', totalTransactionAmount[0]?.total || 0);
        
    } finally {
        await client.close();
    }
}

runQueries().catch(console.dir);
