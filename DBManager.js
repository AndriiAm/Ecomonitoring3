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
    password : 'Bodyspray345#',
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
let ValuesLoad = 0;

app.get("/", function(req, res){


    connection.query("SELECT * FROM Pollutant", function(err, data) {
        if(err) return console.log(err);
        PollutantLoad  = data

    });



    connection.query("SELECT * FROM MonitorObjects", function(err, data1) {
        if(err) return console.log(err);
        MonitorObjectsLoad  = data1
    });


    connection.query("SELECT * FROM StandartValues", function(err, data7) {
        if(err) return console.log(err);
        ValuesLoad  = data7
    });







    connection.query("SELECT * FROM Pollution", function(err, data2) {
        if(err) return console.log(err);
        PollutionLoad = data2
        res.render("index.hbs", {
            Pollutant : PollutantLoad,
            Pollution : PollutionLoad,
            MonitorObjects : MonitorObjectsLoad,
            StandartValues : ValuesLoad


        });


    });


});

function Compare(Human){

    if(Human > Math.pow(10,-3)){
        return "Високий";
    }else if(Math.pow(10,-3) >= Human && Human > Math.pow(10,-4) ){
        return "Середній";
    }else if(Math.pow(10,-4) >= Human && Human > Math.pow(10,-6)){
        return "Низький";
    }else{
        return "Мінімальний";
    }


}




hbs.registerHelper("MainTable", function(a,b,c,d,e){


    let result="";
    let tempMan = "";
    let tempWoman = "";

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

    let temp = b - 1;

    if (d > PollutantLoad[temp].AvgDaily) {
        result += `<td>${d} </td>`;
    } else {
        result += `<td >${d} </td>`;

    }

    if (e > PollutantLoad[temp].MaxOneTime) {
        result += `<td >${e} </td>`;
    } else {
        result += `<td>${e} </td>`;

    }

    tempMan += ((( d * ValuesLoad[5].Man * ValuesLoad[3].Man ) + (e *
        ValuesLoad[4].Man * ValuesLoad[2].Man )) * ValuesLoad[6].Man * ValuesLoad[7].Man) / (100 * ValuesLoad[0].Man * ValuesLoad[1].Man * 365 );


    result += `<td >${tempMan} </td>`;


    let CompareResult = Compare(tempMan);
    result += `<td >${CompareResult} </td>`;

    tempWoman += ( (( d * ValuesLoad[5].Woman * ValuesLoad[3].Woman ) + (e *
        ValuesLoad[4].Woman * ValuesLoad[2].Woman )) * ValuesLoad[6].Woman * ValuesLoad[7].Woman) / (100 * ValuesLoad[0].Woman * ValuesLoad[1].Woman * 365 );

    result += `<td >${tempWoman} </td>`;

    let CompareResult1 = Compare(tempWoman);
    result += `<td >${CompareResult1} </td>`;


    return new hbs.SafeString(`<tr class="row">${result}</tr>`);


});

hbs.registerHelper("SecondTable", function(a,b,c,d){

    let result1 ="";
    let HQD = "";


    for(let i =0; i <PollutantLoad.length; i++){
        if(b == PollutantLoad[i].ID){
            result1  += `<td class = "cell">${PollutantLoad[i].PollutantName} </td>`;
        }
    }
    for(let i = 0; i < MonitorObjectsLoad.length; i++){
        if(a == MonitorObjectsLoad[i].ID){
            result1  += `<td class = "cell">${MonitorObjectsLoad[i].ObjectName} </td>`;
        }

    }

    result1  += `<td class = "cell">${c} </td>`;

    let temp = b - 1;

    if (d > PollutantLoad[temp].AvgDaily) {
        result1  += `<td>${d} </td>`;
    } else {
        result1  += `<td >${d} </td>`;
    }

    for(let i  = 0; i < PollutantLoad.length; i++){
        if(b == PollutantLoad[i].ID){
            HQD = d/PollutantLoad[temp].RfC;
            result1 += `<td>${HQD.toFixed(2)} </td>`;
        }
    }

    if(HQD > 1){
        let HighRisk = "Імовірність розвитку шкідливих ефектів";
        result1 += `<td>${HighRisk} </td>`;
    }else if(HQD < 1){
        let LowRisk = "Малий ризик виникнення шкідливих ефектів";
        result1 += `<td>${LowRisk} </td>`;
    }else{
        let MedRisk = "Гранична величина, що не потребує термінових заходів";
        result1 += `<td>${MedRisk} </td>`;
    }

    return new hbs.SafeString(`<tr class="row">${result1}</tr>`);
});


const port = 3307;
app.listen(port, () =>
    console.log(`App listening on port ${port}`)
);

