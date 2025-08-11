const axios=require('axios');
const BASE_URL='http://backend:3001/api';
const testAuth=async()=>{
try{
console.log('Testing registration...');
const registerResponse=await axios.post(`${BASE_URL}/auth/register`,{
email:'test@example.com',
password:'password123'
});
console.log('Register response:',registerResponse.data);
const token=registerResponse.data.token;
console.log('\nTesting login...');
const loginResponse=await axios.post(`${BASE_URL}/auth/login`,{
email:'test@example.com',
password:'password123'
});
console.log('Login response:',loginResponse.data);
console.log('\nTesting health endpoint...');
const healthResponse=await axios.get(`${BASE_URL}/health`);
console.log('Health response:',healthResponse.data);
}catch(error){
console.error('Test failed:',error.response?.data||error.message);
}
};
testAuth(); 