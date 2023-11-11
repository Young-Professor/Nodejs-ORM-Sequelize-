const {
  Staffs,
  Class,
  Streams,
  Departments,
  DepartmentHead,
} = require("../models/tables");

const addStaff = async (req, res) => {
  const { firstName, lastName, number, teachingType } = req.body;
  try {
    const Staff = await Staffs.create({
      firstName,
      lastName,
      number,
      teachingType,
    });
    res.send(Staff);
  } catch (err) {
    console.log(err);
    res.status(500).send("Someting has gone wrong");
  }
};

const addClass = async (req, res) => {
  const { name, abbreviation, headID } = req.body;
  try {
    const clas = await Class.create({
      name,
      abbreviation,
      headID,
    });
    res.send(clas);
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to create a class: " + error.message);
  }
};

const addStream = async (req, res) => {
  const { name, abbreviation, classID, teacher } = req.body;
  try {
    const tream = await Streams.create({
      name,
      abbreviation,
      classID,
      teacher,
    });
    res.send(tream);
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to create a stream: " + error.message);
  }
};

const createDepartment = async (req, res) => {
  const { name, headID } = req.body;
  if (!headID) {
    return res.status(400).json({ error: "Please provide the HOD" });
  }
  try {
        // Check if the staff with headID exists and is of teaching type
        const headStaff = await Staffs.findByPk(headID);
        if (!headStaff || headStaff.teachingType !== 'TEACHING') {
          return res.status(400).json({ error: "Provided HOD ID is not a valid teaching staff." });
        }
    const department = await Departments.create({ name,headID });
    if (department) {
      const head = await DepartmentHead.create({
        startDate: new Date(),
        headID,
        departmentID: department.id,
      });
      res.send(head);
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send("Error trying to create a Department: "+error.message);
  }
};



const updateDepartmentalHead = async (req, res) => {
  try {
    const { departmentID, headID } = req.body;

    // Find the current HOD if there is one
    const currentHOD = await DepartmentHead.findOne({
      where: {
        departmentID,
        endDate: null, // Assuming null end date means they're the current HOD
      },
    });

    // If there's a current HOD, update their end date
    if (currentHOD) {
      currentHOD.endDate = new Date(); // Set the end date to the current date
      await currentHOD.save();
    }

    // Create a new HOD entry
    const newHOD = await DepartmentHead.create({
      departmentID,
      headID,
      startDate: new Date(),
    });

    res.status(201).json({ message: "HOD updated successfully.", newHOD });
  } catch (error) {
    console.log(error);
    res.status(500).json("Failed to update the HOD: " + error.message);
  }
};

module.exports = {
  addStaff,
  addClass,
  addStream,
  createDepartment,
  updateDepartmentalHead,
};
