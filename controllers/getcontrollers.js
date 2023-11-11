const { Staffs, Departments, DepartmentHead, Class, Streams } = require('../models/tables');

//get the staff and all his relations
const getAllStaff = async (req, res) => {
    try {
        const allStaffs = await Staffs.findAll({
            attributes: ['id', 'firstName', 'lastName', 'number', 'teachingType'],
            include: [
                {
                    model: DepartmentHead,
                    as: 'Head of Department', 
                    attributes:['startDate', 'endDate'],
                    include: [
                        {
                            model: Departments,
                            as: 'HODDepartment',
                            attributes: ['name'], // only get the name of the department
                        }
                    ],
                },
                {
                    model: Class,
                    as: 'HeadedClasses',
                    attributes: ['name', 'abbreviation'], // only get the name and abbreviation of the class
                },
                {
                    model:Streams, 
                    as: 'TaughtStreams',
                    attributes: ['name', 'abbreviation'],
                }
              
            ]

        });

        res.json(allStaffs);
    } catch (error) {
        res.status(500).send("Something went wrong trying to get all staffs: " + error.message);
    }
};

//Get the class and its relation
const getClasses= async (req,res)=>{
    try{
        const classes= await Class.findAll({
            attributes: ['id', 'name', 'abbreviation'], 
            include: [
                {
                    model:Staffs,
                    as:'Head Of this Classes',
                    attributes: ['firstName']
                },
                {
                    model: Streams,
                    as: 'Streams',
                    attributes: ['name', 'abbreviation'],
                    include: [
                        {
                            model: Staffs,
                            as: 'Teacher',
                            attributes: ['firstName'],
                        }
                    ]
                }
            ]
        });
        res.json(classes);
    }catch(error){
        res.status(500).send("Something went wrong trying to get all classes: " + error.message);
    }
}

//get department and its relations
const getDepartment= async (req,res)=>{
    try{
        const departments= await Departments.findAll({
            attributes: ['id', 'name'],
            include: [
                {
                    model: DepartmentHead,
                    as: 'DepartmentHead',
                    attributes: ['startDate', 'endDate'],
                    include: [
                        {   
                            model: Staffs,
                            as: 'Department Head',
                            attributes: ['firstName']
                        }
                    ]
                }
            ]
        });
        res.json(departments);
    }catch(error){
        res.status(500).send("Something went wrong trying to get all departments: " + error.message);

    }

}




module.exports = {getAllStaff, getClasses, getDepartment};
