const API_URL = 'http://127.0.0.1:5000/api/auth';

async function test() {
    console.log('🧪 Starting API Verification...');

    const email = `verify_final_${Date.now()}@example.com`;
    const emailUpper = email.toUpperCase();
    const password = 'password123';

    try {
        // 1. Register
        console.log(`\n1. Registering user: ${email}`);
        const regRes = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: 'Test',
                lastName: 'User',
                email: email, // Register with lowercase
                password: password,
                confirmPassword: password
            })
        });

        let regData;
        try {
            regData = await regRes.json();
            if (!regRes.ok) {
                if (regRes.status === 409) {
                    console.log('User already exists, proceeding to login...');
                } else {
                    console.error('❌ Registration failed:', regData);
                    return;
                }
            } else {
                console.log('✅ Registration successful');
            }
        } catch (e) {
            console.error('❌ JSON Parse Error (Registration):', e);
            console.log('Status Text:', regRes.statusText);
            return;
        }

        // 2. Login with Uppercase Email
        console.log(`\n2. Logging in with uppercase email: ${emailUpper}`);
        const loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: emailUpper,
                password: password
            })
        });

        try {
            const loginData = await loginRes.json();
            if (loginRes.ok) {
                console.log('✅ Login successful with uppercase email!');
            } else {
                console.error('❌ Login failed with uppercase email:', loginData);
            }
        } catch (e) {
            console.error('❌ JSON Parse Error (Login):', e);
        }

        // 3. Check Email with Mixed Case
        console.log(`\n3. Checking email existence with mixed case: ${emailUpper}`);
        const checkRes = await fetch(`${API_URL}/check-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailUpper })
        });

        try {
            const checkData = await checkRes.json();
            if (checkRes.ok && checkData.user) {
                console.log('✅ Check Email successful with mixed case!');
                console.log(`   Found user: ${checkData.user.email}`);
            } else {
                console.error('❌ Check Email failed:', checkData);
            }
        } catch (e) {
            console.error('❌ JSON Parse Error (Check Email):', e);
        }

    } catch (error) {
        console.error('❌ Script Error:', error);
    }
}

test();
