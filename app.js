const express = require("express");
const app = express();
const path = require("path");
const {open} = require("sqlite");
const sqlite = require("sqlite3");
const 

app.use(express.json());

const dbPath = path.join(__dirname, "todoApplication.db");
let db = null

const initializeDbAndServer = async () => {
    try {
        db = async open({
            filename : dbPath,
            driver : sqlite.Database
        });
        app.listen(3000, () = {
            console.log("Server Is Up And At http://localhost:3000/");
        });
    }catch(e){
        console.log(`DB Error ${e.message}`);
        process.exit(1);
    }
}

initializeDbAndServer();


app.get("/todos/", async(request, response) => {
    
})
