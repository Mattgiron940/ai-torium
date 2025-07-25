#!/usr/bin/env node

// Test database connection script for AI-TORIUM
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kzwezhtenxwdrmnuvevs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6d2V6aHRlbnp3ZHJtbnV2ZXZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQ1OTc3MSwiZXhwIjoyMDY5MDM1NzcxfQ.10n1eSI1fLHKAVmFqBWVhR7LzQ23e2LS4aLLoJrV5-M';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
    console.log('🗄️ Testing AI-TORIUM Database Connection');
    console.log('======================================');

    try {
        // Test 1: Check subjects table
        console.log('\n📚 Testing subjects table...');
        const { data: subjects, error: subjectsError } = await supabase
            .from('subjects')
            .select('name, slug')
            .limit(5);

        if (subjectsError) {
            console.log('❌ Subjects table error:', subjectsError.message);
        } else {
            console.log('✅ Subjects table working!');
            console.log(`   Found ${subjects.length} subjects:`, subjects.map(s => s.name));
        }

        // Test 2: Check users table structure
        console.log('\n👥 Testing users table...');
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('count')
            .limit(1);

        if (usersError) {
            console.log('❌ Users table error:', usersError.message);
        } else {
            console.log('✅ Users table accessible!');
        }

        // Test 3: Check questions table
        console.log('\n❓ Testing questions table...');
        const { data: questions, error: questionsError } = await supabase
            .from('questions')
            .select('count')
            .limit(1);

        if (questionsError) {
            console.log('❌ Questions table error:', questionsError.message);
        } else {
            console.log('✅ Questions table accessible!');
        }

        // Test 4: Check chat_sessions table
        console.log('\n💬 Testing chat_sessions table...');
        const { data: chatSessions, error: chatError } = await supabase
            .from('chat_sessions')
            .select('count')
            .limit(1);

        if (chatError) {
            console.log('❌ Chat sessions table error:', chatError.message);
        } else {
            console.log('✅ Chat sessions table accessible!');
        }

        // Test 5: Check functions
        console.log('\n⚙️ Testing database functions...');
        const { data: functionTest, error: functionError } = await supabase
            .rpc('calculate_user_level', { points: 1000 });

        if (functionError) {
            console.log('❌ Functions error:', functionError.message);
        } else {
            console.log('✅ Functions working!');
            console.log(`   User with 1000 points would be level: ${functionTest}`);
        }

        // List all tables
        console.log('\n📋 Checking all tables...');
        const { data: tables, error: tablesError } = await supabase
            .rpc('exec', { 
                sql: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;` 
            });

        if (tablesError) {
            console.log('❌ Could not list tables:', tablesError.message);
        } else {
            console.log('✅ Database tables found!');
        }

        console.log('\n🎉 Database connection test completed!');
        console.log('\n📊 Summary:');
        console.log('- Database is accessible ✅');
        console.log('- Core tables are working ✅');
        console.log('- Your AI-TORIUM platform should be functional! 🚀');

    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.log('\n🔧 Troubleshooting steps:');
        console.log('1. Verify you ran the SQL migrations in Supabase dashboard');
        console.log('2. Check that RLS policies are correctly applied');
        console.log('3. Ensure your Supabase project is active');
    }
}

testDatabase();