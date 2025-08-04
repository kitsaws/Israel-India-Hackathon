const path = require('path')
const mongoose = require('mongoose');
const Patient = require(path.join(__dirname,'..','models','patient'));
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

// Generate a random age
function generateAge(low,high){
    return low + Math.floor(Math.random()*(high-low+1))
}


// Generate a random gender from a defined list
function generateGender() {
    const genders = ['Male', 'Female', 'Other'];
    const index = Math.floor(Math.random() * genders.length);
    return genders[index];
}


async function seedPatients() {
  await Patient.deleteMany({}); 

  for (let i = 0; i < 5; i++) {
    const name = faker.person.fullName();
    const username = generateUsername(name);
    const password = generatePassword();
    const age = generateAge(1,80)
    const gender = generateGender()

    const newPatient = new Patient({ name, username , age , gender , family : []});
    await Patient.register(newPatient, password);


    console.log(`Created patient: ${name} | username: ${username} | password: ${password}`);
  }
  
  mongoose.connection.close();
}

// seedPatients();


async function personalSeedPatient() {

    const name = faker.person.fullName();
    const username = 'siddy'
    const password = 'siddy'
    const age = 20
    const gender = 'Male'

    const newPatient = new Patient({ name, username , age , gender , family : []});
    await Patient.register(newPatient, password);


    console.log(`Created patient: ${name} | username: ${username} | password: ${password}`);
  
  mongoose.connection.close();
}


personalSeedPatient()
