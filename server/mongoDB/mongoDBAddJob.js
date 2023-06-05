const mongoose = require("mongoose");
const skillSchema = new mongoose.Schema({
  value: String,
});
const AddJobSchema = new mongoose.Schema({
  companyName: { type: String },
  companyLogo: { type: String },
  jobPosition: { type: String },
  jobDuration: { type: Number },
  jobVacancy: { type: Number },
  monthlySalary: { type: Number },
  jobType: { type: String },
  workPlace: { type: String },
  location: { type: String },
  jobDescription: { type: String },
  aboutCompany: { type: String },
  skill: [skillSchema],
});
module.exports = mongoose.model("AddJob", AddJobSchema);
