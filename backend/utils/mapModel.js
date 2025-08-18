const path = require('path')
const Patient = require(path.join(__dirname,'..','models','patient'));
const Doctor = require(path.join(__dirname,'..','models','doctor'));
const Nurse = require(path.join(__dirname,'..','models','nurse'));
const Family = require(path.join(__dirname,'..','models','family'));

const models = {
  patient: Patient,
  doctor: Doctor,
  nurse: Nurse,
  family: Family
};

module.exports = models;
