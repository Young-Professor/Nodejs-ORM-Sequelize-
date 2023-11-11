const Sequelize = require('sequelize')
const sequelize = require('../utils/database')

// Staffs table
const Staffs = sequelize.define('Staffs', {
    firstName:{
        type:Sequelize.STRING,
        allowNull:false,
        validate: {
            notEmpty: true,
             }
        },
        lastName:{
            type:Sequelize.STRING,
            allowNull:false,
            validate:{
                notEmpty: true,
            }
        },
        number: {
            type: Sequelize.STRING, 
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
            }
        },
        teachingType: {
            type: Sequelize.ENUM('TEACHING', 'NON-TEACHING'),
            allowNull: false,
            validate: {
                notEmpty: true,
        }
     }
})
// Class table
const Class=sequelize.define('Class',{
    name:{
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
            notEmpty: {
                msg: 'Class is required'
            }
        }
    },
    abbreviation:{
        type: Sequelize.STRING,
        allowNull:false,
    },
    headID:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Staffs',
            key: 'id'
        },
        validate:{
            async isTeachingStaffs(value){
                const Staff = await Staffs.findByPk(value)
                if (Staff.teachingType !== "TEACHING") {
                    throw new Error('Staffs is not a teaching Staffs')
                }
            }
        }
    }
})

 
// Streams table
const Streams = sequelize.define('Streams', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Stream name is required'
            }
        }
    },
    abbreviation: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Abbreviation is required'
            }
        }
    },
    teacher: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Staffs',
            key: 'id',
        },
        validate: {
            async isTeachingStaffs(value) {
                const staff = await Staffs.findByPk(value);
                if (!staff || staff.teachingType !== 'TEACHING') {
                    throw new Error('Staff is not a teaching staff');
                }
            }
        }
    },
    classID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Classes',
            key: 'id',
        },
        validate: {
            notEmpty: {
                msg: 'Stream must belong to a particular class'
            }
        }
    }
});

// Department table
const Departments= sequelize.define('Departments',{
    name:{
        type: Sequelize.STRING,
        allowNull:false,
        validate:{
            notEmpty: {
                msg: 'Department is required'
            }
        }
    },
})

// Departmental head pivotal table
const DepartmentHead= sequelize.define('DepartmentHead',{
    startDate:{
        type: Sequelize.DATE,
        allowNull: false,
        validate:{
            notEmpty: {
                msg: 'Start Date is required'
        }   
      }
    },
    endDate:{
        type: Sequelize.DATE,
        allowNull: true,
    },
    departmentID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
        model: 'Departments',
        key: 'id'
        }
    },
    headID:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Staffs',
            key: 'id',
        },
            validate:{
                isTeachingStaff: async (value) => {
                    const staff = await Staffs.findByPk(value)
                    if (staff.teachingType !== 'TEACHING') {
                        throw new Error('Staff is not a teaching staff')
                    }
                }
            }
    },

})

// Department associations
DepartmentHead.belongsTo(Departments, { foreignKey: 'departmentID', as: 'HODDepartment' });
Departments.hasMany(DepartmentHead, { foreignKey: 'departmentID', as: 'HODDepartment' });

// Staff associations
Staffs.hasOne(DepartmentHead, { foreignKey: 'headID', as: 'Head of Department' });
DepartmentHead.belongsTo(Staffs, { foreignKey: 'headID', as: 'Department Head' });

Staffs.hasMany(Class, { foreignKey: 'headID', as: 'HeadedClasses' });
Class.belongsTo(Staffs, {foreignKey:'headID', as: 'HeadedClasses'})

Staffs.belongsTo(Departments, { foreignKey: 'departmentID', as: 'HOD' });
Departments.hasMany(Staffs, { foreignKey: 'departmentID', as: 'HOD' });

// DepartmentHead associations
Departments.hasMany(DepartmentHead, { foreignKey: 'departmentID', as: 'DepartmentHead' });
DepartmentHead.belongsTo(Departments, {foreignKey:"departmentID", as: 'DepartmentHead'})

// Streams associations
Staffs.hasMany(Streams, { foreignKey: 'teacher', as: 'TaughtStreams' });
Streams.belongsTo(Staffs, { foreignKey: 'teacher', as: 'Teacher' });

// Class and Streams associations
Class.belongsTo(Staffs, { foreignKey: 'headID', as: 'Head Of this Classes' });
Streams.belongsTo(Class, { foreignKey: 'classID' });
Class.hasMany(Streams,{foreignKey:'classID'})


module.exports = {Staffs,Class,Streams, DepartmentHead,  Departments};