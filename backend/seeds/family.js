const path = require('path');
const mongoose = require('mongoose');
const Family = require(path.join(__dirname, '..', 'models', 'family'));
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

const relations = [
    'son',
    'daughter',
    'father',
    'mother',
];

function generateRelation() {
    return relations[Math.floor(Math.random() * relations.length)];
}

async function seedFamily() {
    await Family.deleteMany({});

    for (let i = 0; i < 5; i++) {

        const name = faker.person.fullName();
        const username = generateUsername(name);
        const password = generatePassword();
        const relation = generateRelation();

        // Create a new family member with random data
        const member = new Family({ name, username, relation });

        // Register the member with a password
        await Family.register(member, password);

        console.log(`Created family: ${name} | username: ${username} | password: ${password}`);
    }

    mongoose.connection.close(); 
}


// seedFamily();


async function seedFamilyPersonal() {

      const name = faker.person.fullName();
      const username = 'familyGuy'
      const password = 'familyGuy'
      const relation = generateRelation();

      // Create a new family member with random data
      const member = new Family({ name, username, relation });

      // Register the member with a password
      await Family.register(member, password);

      console.log(`Created family: ${name} | username: ${username} | password: ${password}`);
  

  mongoose.connection.close(); 
}


seedFamilyPersonal()