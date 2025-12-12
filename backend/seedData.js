require('dotenv').config();
const mongoose = require('mongoose');
const Court = require('./models/Court');
const Coach = require('./models/Coach');
const Equipment = require('./models/Equipment');
const PricingRule = require('./models/PricingRule');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        // Clear existing data
        await Court.deleteMany({});
        await Coach.deleteMany({});
        await Equipment.deleteMany({});
        await PricingRule.deleteMany({});

        console.log('Cleared existing data');

        // Create Courts
        const courts = await Court.insertMany([
            { name: 'Court A - Indoor', type: 'indoor', basePrice: 25, isActive: true },
            { name: 'Court B - Indoor', type: 'indoor', basePrice: 25, isActive: true },
            { name: 'Court C - Outdoor', type: 'outdoor', basePrice: 15, isActive: true },
            { name: 'Court D - Outdoor', type: 'outdoor', basePrice: 15, isActive: true },
        ]);
        console.log(`Created ${courts.length} courts`);

        // Create Coaches
        const coaches = await Coach.insertMany([
            { name: 'John Smith', specialization: 'Badminton Pro', hourlyRate: 30, isAvailable: true },
            { name: 'Sarah Johnson', specialization: 'Tennis Expert', hourlyRate: 35, isAvailable: true },
            { name: 'Mike Davis', specialization: 'All Sports', hourlyRate: 25, isAvailable: true },
        ]);
        console.log(`Created ${coaches.length} coaches`);

        // Create Equipment
        const equipment = await Equipment.insertMany([
            { type: 'racket', totalStock: 20, availableStock: 20, pricePerUnit: 5 },
            { type: 'shoes', totalStock: 15, availableStock: 15, pricePerUnit: 3 },
        ]);
        console.log(`Created ${equipment.length} equipment items`);

        // Create Pricing Rules
        const rules = await PricingRule.insertMany([
            {
                name: 'Peak Hours',
                ruleType: 'peak',
                startTime: '18:00',
                endTime: '21:00',
                multiplier: 1.5,
                surcharge: 0,
                isActive: true,
            },
            {
                name: 'Weekend Premium',
                ruleType: 'weekend',
                daysOfWeek: [0, 6], // Sunday and Saturday
                multiplier: 1,
                surcharge: 10,
                isActive: true,
            },
            {
                name: 'Morning Discount',
                ruleType: 'custom',
                startTime: '06:00',
                endTime: '09:00',
                multiplier: 0.8,
                surcharge: 0,
                isActive: true,
            },
        ]);
        console.log(`Created ${rules.length} pricing rules`);

        console.log('\n✅ Sample data seeded successfully!');
        console.log('\nSummary:');
        console.log(`- ${courts.length} Courts`);
        console.log(`- ${coaches.length} Coaches`);
        console.log(`- ${equipment.length} Equipment types`);
        console.log(`- ${rules.length} Pricing rules`);

    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    }
};

// Run the seeder
connectDB().then(() => seedData());
