import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Client from '../models/Client.js';
import Submission from '../models/Submission.js';

// Load environment variables
dotenv.config();

// Sample data arrays for realistic test data
const firstNames = ['Ahmed', 'Mohamed', 'Fatima', 'Aisha', 'Hassan', 'Youssef', 'Zainab', 'Omar', 'Mariam', 'Ali', 'Sara', 'Ibrahim', 'Noor', 'Karim', 'Layla'];
const lastNames = ['El-Sayed', 'Hassan', 'Mahmoud', 'Ibrahim', 'Ahmed', 'Abdallah', 'Khalil', 'Mansour', 'Farouk', 'Saleh', 'Nasser', 'Rashid', 'Youssef', 'Hamza', 'Saeed'];
const cities = ['Cairo', 'Alexandria', 'Giza', 'Casablanca', 'Tunis', 'Algiers', 'Rabat', 'Amman', 'Beirut', 'Dubai'];
const services = ['us_lottery', 'canada_immigration', 'work_visa', 'study_abroad', 'family_reunion', 'soccer_talent'];
const statuses = ['new', 'in_review', 'completed'];
const sources = ['website', 'whatsapp', 'phone', 'email'];
const workflowStatuses = ['pending_validation', 'validated', 'call_confirmed', 'documents_requested', 'documents_uploaded', 'documents_verified'];

// Generate random phone number
const generatePhone = () => {
  const countryCode = ['+20', '+212', '+216', '+213', '+962', '+971'][Math.floor(Math.random() * 6)];
  const number = Math.floor(Math.random() * 900000000) + 100000000;
  return `${countryCode}${number}`;
};

// Generate random email
const generateEmail = (firstName, lastName) => {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@${domains[Math.floor(Math.random() * domains.length)]}`;
};

// Generate random date within last N days
const getRandomDate = (daysBack) => {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * daysBack);
  return new Date(now.getTime() - randomDays * 24 * 60 * 60 * 1000);
};

// Generate random message
const generateMessage = () => {
  const messages = [
    'أريد التقديم على القرعة الأمريكية',
    'مهتم بالهجرة إلى كندا، أرجو التواصل',
    'أحتاج معلومات عن تأشيرة العمل',
    'أرغب في الدراسة بالخارج',
    'أريد معلومات عن لم الشمل',
    'I want to apply for US lottery',
    'Interested in Canada immigration',
    'Need work visa information',
    'Looking for study abroad options'
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};

// Generate test clients
const generateClients = (count) => {
  const clients = [];
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    clients.push({
      name: `${firstName} ${lastName}`,
      email: generateEmail(firstName, lastName),
      phone: generatePhone(),
      service: services[Math.floor(Math.random() * services.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      message: generateMessage(),
      date: getRandomDate(365),
      createdAt: getRandomDate(365),
    });
  }
  return clients;
};

// Generate test submissions
const generateSubmissions = (count) => {
  const submissions = [];
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    submissions.push({
      name: `${firstName} ${lastName}`,
      email: generateEmail(firstName, lastName),
      phone: generatePhone(),
      service: services[Math.floor(Math.random() * services.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      message: generateMessage(),
      timestamp: getRandomDate(180),
      workflowStatus: workflowStatuses[Math.floor(Math.random() * workflowStatuses.length)],
      convertedToClient: Math.random() > 0.8, // 20% converted
      createdAt: getRandomDate(180),
    });
  }
  return submissions;
};

// Main seed function
const seedDatabase = async (clientCount, submissionCount) => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('📊 Generating test data...');
    const startGenerate = Date.now();
    const clients = generateClients(clientCount);
    const submissions = generateSubmissions(submissionCount);
    const generateTime = Date.now() - startGenerate;
    console.log(`✅ Generated ${clientCount} clients and ${submissionCount} submissions in ${generateTime}ms\n`);

    // Insert clients
    console.log('📥 Inserting clients...');
    const startClients = Date.now();
    await Client.insertMany(clients, { ordered: false });
    const clientsTime = Date.now() - startClients;
    console.log(`✅ Inserted ${clientCount} clients in ${clientsTime}ms (${Math.round(clientCount / (clientsTime / 1000))} records/sec)\n`);

    // Insert submissions
    console.log('📥 Inserting submissions...');
    const startSubmissions = Date.now();
    await Submission.insertMany(submissions, { ordered: false });
    const submissionsTime = Date.now() - startSubmissions;
    console.log(`✅ Inserted ${submissionCount} submissions in ${submissionsTime}ms (${Math.round(submissionCount / (submissionsTime / 1000))} records/sec)\n`);

    // Get totals
    const totalClients = await Client.countDocuments();
    const totalSubmissions = await Submission.countDocuments();

    console.log('📈 Database Statistics:');
    console.log(`   Total Clients: ${totalClients}`);
    console.log(`   Total Submissions: ${totalSubmissions}`);
    console.log(`   Total Records: ${totalClients + totalSubmissions}\n`);

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Parse command line arguments
const args = process.argv.slice(2);
const clientCount = parseInt(args[0]) || 100;
const submissionCount = parseInt(args[1]) || 100;

console.log('🌱 Database Seeding Tool');
console.log('========================\n');
console.log(`Target: ${clientCount} clients, ${submissionCount} submissions\n`);

seedDatabase(clientCount, submissionCount);
