const mysql   = require('mysql');
const express = require("express");
const hbs = require("hbs");
//створюємо об'єкт додатку
const app = express();

app.use(express.static('public'));



// встановлює Handlebars як двигун представлень в Express
app.set("view engine", "hbs");


const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'EcoMonitoring3'
});

connection.connect(function(err){
    if (err) {
        return console.error("Error-connect: " + err.message);
    }
    else{
        console.log("Connection to MySQL OK!");
    }
});

let PollutantLoad =  0;
let PollutionLoad = 0;
let MonitorObjectsLoad = 0;

app.get("/", function(req, res){


    connection.query("SELECT * FROM Pollutant", function(err, data) {
        if(err) return console.log(err);
        PollutantLoad  = data

    });



    connection.query("SELECT * FROM MonitorObjects", function(err, data1) {
        if(err) return console.log(err);
        MonitorObjectsLoad  = data1
    });



    connection.query("SELECT * FROM Pollution", function(err, data2) {
        if(err) return console.log(err);
        PollutionLoad = data2
        res.render("index.hbs", {
            Pollutant : PollutantLoad,
            Pollution : PollutionLoad,
            MonitorObjects : MonitorObjectsLoad


        });


    });


});


hbs.registerHelper("MainTable", function(a,b,c, d,e ){


    let result="";

    for(let i =0; i <PollutantLoad.length; i++){
        if(b == PollutantLoad[i].ID){
            result += `<td class = "cell">${PollutantLoad[i].PollutantName} </td>`;
        }
    }
    for(let i = 0; i < MonitorObjectsLoad.length; i++){
        if(a == MonitorObjectsLoad[i].ID){
            result += `<td class = "cell">${MonitorObjectsLoad[i].ObjectName} </td>`;
        }

    }

    result += `<td class = "cell">${c} </td>`;

    for(let i  = 0; i < PollutantLoad.length; i++){
        if(b == PollutantLoad[i].ID){
            result += `<td class = "cell">${PollutantLoad[i].AvgDaily} </td>`;
            result += `<td class = "cell">${PollutantLoad[i].MaxOneTime} </td>`;

        }
    }
    let temp = b - 1;

    if (d > PollutantLoad[temp].AvgDaily) {
        result += `<td style="color:red">${d} </td>`;
    } else {
        result += `<td style="color:green">${d} </td>`;

    }

    if (e > PollutantLoad[temp].MaxOneTime) {
        result += `<td style="color:red">${e} </td>`;
    } else {
        result += `<td style="color:green">${e} </td>`;

    }
    return new hbs.SafeString(`<tr class="row">${result}</tr>`);


});


const port = 3307;
app.listen(port, () =>
    console.log(`App listening on port ${port}`)
);

