const express= require("express")
const cors=require("cors")
const bodyParser=require("body-parser")
const app= express()
const port= 8000

app.use(cors())
app.use(bodyParser.json())

//import database conections
const sequelize= require("./utils/database")

//get different get and post routes
const routes=require('./routes'

)
app.use(express.json())

app.use('/api',routes)


app.get("/", (req,res)=>{
    res.send("Hello from Homepage")
})

// Testing connection
sequelize.authenticate().then(()=>{
    console.log("Database connected")
}).catch((err)=>{
    console.log(err)
})


sequelize.sync({force:false}).then(()=>{
app.listen(port, ()=>{
    console.log("Server is running on port 8000")
})
})

























// sequelize.sync({ alter: true }).then(() => {
//     // Find the Streams model and drop the table
//     DepartmentHead.sync({ force: true }).then(() => {
//         console.log("DepartmentHead table dropped and recreated");
//     });

//     app.listen(port, () => {
//         console.log("Server is running on port 8000");
//     });
// });
 