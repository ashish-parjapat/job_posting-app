const express = require("express");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const app = express();
require("dotenv").config();

app.use(express.json({ limit: "50mb" }));
var cors = require("cors");
app.use(cors());
var bodyParser = require("body-parser");
const User = require("./mongoDB/mongoDBConnection");
const AddJob = require("./mongoDB/mongoDBAddJob");
const verifyToken = require("./jwtToken/verifyJwtToken");

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.get("/", async (req, res) => {
  try {
    const skill = req.query.skill || "";
    if (skill) {
      const AddJobs = await AddJob.find({
        "skill.value": {
          $all: skill,
        },
      });
      res.status(201).json(AddJobs);
    } else {
      const AddJobs = await AddJob.find();
      res.status(201).json(AddJobs);
    }
  } catch (err) {
    console.error("Failed to fetch data:", err);
    res.status(500).send("Failed to fetch data");
  }
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, number, password } = req.body;
    const oldUser = await User.findOne({ email });

    if (name && email && number && password && !oldUser) {
      encryptedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        number,
        password: encryptedPassword,
      });

      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      user.token = token;

      res.status(201).json(user);
    } else if (!(name && email && number && password)) {
      res.status(400).send("All input Field is required");
    } else if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      user.token = token;

      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (error) {
    console.log(error);
  }
});

app.post("/procted", verifyToken, async (req, res) => {
  try {
    const {
      companyName,
      companyLogo,
      jobPosition,
      jobDuration,
      jobVacancy,
      monthlySalary,
      jobType,
      workPlace,
      location,
      jobDescription,
      aboutCompany,
      skill,
    } = req.body;
 
    const oldSameJob = await AddJob.findOne({ jobDescription });
    if (
      (companyName && companyLogo && jobPosition && jobDuration && jobVacancy,
      monthlySalary &&
        jobType &&
        workPlace &&
        location &&
        jobDescription &&
        aboutCompany &&
        skill &&
        !oldSameJob)
    ) {
      const addJob = await AddJob.create({
        companyName,
        companyLogo,
        jobPosition,
        jobDuration,
        jobVacancy,
        monthlySalary,
        jobType,
        workPlace,
        location,
        jobDescription,
        aboutCompany,
        skill,
      });
      res.status(201).json(addJob);
    } else if (
      !(
        companyName &&
        companyLogo &&
        jobPosition &&
        jobDuration &&
        jobVacancy &&
        monthlySalary &&
        jobType &&
        workPlace &&
        location &&
        jobDescription &&
        aboutCompany &&
        skill
      )
    ) {
      res.status(400).send("All input Field is required");
    } else if (oldSameJob) {
      return res.status(409).send("Job Already Exist. Please Login");
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/edit/:id", async (req, res) => {
  try {
    const AddJobss = await AddJob.findById(req.body.id);
    AddJobss.companyName = req.body.companyName;
    AddJobss.companyLogo = req.body.companyLogo;
    AddJobss.jobPosition = req.body.jobPosition;
    AddJobss.jobDuration = req.body.jobDuration;
    AddJobss.monthlySalary = req.body.monthlySalary;
    AddJobss.jobVacancy = req.body.jobVacancy;
    AddJobss.jobType = req.body.jobType;
    AddJobss.workPlace = req.body.workPlace;
    AddJobss.location = req.body.location;
    AddJobss.jobDescription = req.body.jobDescription;
    AddJobss.aboutCompany = req.body.aboutCompany;
    AddJobss.skill = req.body.skill;
    await AddJobss.save();
    res.redirect("/");
    res.status(201).json(addJob);
  } catch (err) {
    console.error("Error updating Job Post:", err.message);
  }
});

app.get("/jobdetails/:id", async (req, res) => {
  try {
    const jobdetails = await AddJob.findById(req.params.id);
    res.status(200).json(jobdetails);
  } catch (err) {
    console.error("Error infd Job Post:", err.message);
  }
});
app.post("/abc", verifyToken, async (req, res) => {
  res.status(200).json("good");
});

app.listen(5000, () => {
  console.log("connected");
});
