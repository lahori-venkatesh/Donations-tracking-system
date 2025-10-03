#!/usr/bin/env node

console.log('🚀 Starting DonateTrack Backend Server...');
console.log('📡 Server will be available at: http://localhost:5001');
console.log('🔐 Test Credentials:');
console.log('   Donor: donor@test.com / donor123');
console.log('   NGO: ngo@test.com / ngo123');
console.log('   Admin: admin@donatetrack.com / admin123');
console.log('');
console.log('💡 Note: MongoDB not required - using test credentials');
console.log('Press Ctrl+C to stop the server');
console.log('');

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down server...');
  process.exit(0);
});

try {
  require('./src/server.js');
} catch (error) {
  console.error('❌ Server startup failed:', error.message);
  process.exit(1);
}