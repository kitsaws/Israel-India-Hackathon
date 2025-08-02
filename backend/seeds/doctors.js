const path = require('path')
const mongoose = require('mongoose');
const Doctor = require(path.join(__dirname,'..','models','doctor'));
const { faker } = require('@faker-js/faker');


mongoose.connect('mongodb://localhost:27017/loadout')
  .then(() => {
    console.log('Connected to DB');
  })
  .catch(e => {
    console.error('Connection error', e);
  });

// Generate username from name: e.g. "John Doe" => "john.doe"
function generateUsername(name) {
  return name.toLowerCase().replace(/\s+/g, '.');
}

// Generate a random 8 character alphanumeric password
function generatePassword() {
  return Math.random().toString(36).slice(-8);
}


async function seedDoctors() {
  await Doctor.deleteMany({}); 

  for (let i = 0; i < 5; i++) {
    const name = faker.person.fullName();
    const username = generateUsername(name);
    const password = generatePassword();

    const newDoctor = new Doctor({ name, username, patients: [] });
    await Doctor.register(newDoctor, password);


    console.log(`Created doctor: ${name} | username: ${username} | password: ${password}`);
  }
  
  mongoose.connection.close();
}

seedDoctors();
