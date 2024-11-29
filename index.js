const http=require("http");
const fs=require("fs");
var requests=require("requests");
var express = require('express')
var app = express();
var bodyParser=require("body-parser"); 

app.use(bodyParser.urlencoded({extended:true})); 


app.set('view engine', 'ejs');

function kelvinToCelsius(kelvin) {
    return kelvin - 273.15;
}

const homeFile=fs.readFileSync("home.html","utf-8");

const replaceVal=(tempVal,orgVal)=>{
    let temperature=tempVal.replace("{%tempval%}",kelvinToCelsius(orgVal.main.temp).toFixed(2));
    temperature=temperature.replace("{%tempmin%}",kelvinToCelsius(orgVal.main.temp_min).toFixed(2));
    temperature=temperature.replace("{%tempmax%}",kelvinToCelsius(orgVal.main.temp_max).toFixed(2));
    temperature=temperature.replace("{%location%}",orgVal.name);
    temperature=temperature.replace("{%country%}",orgVal.sys.country);
    temperature=temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
    
    return temperature;
};
app.get("/",(req,res)=>{
        res.render('../views/home.ejs')

        
    })
    
app.post("/",(req,res)=>
{
    var cityName = req.body.city;
    console.log(cityName)
    requests(
        "https://api.openweathermap.org/data/2.5/weather?q=" + cityName +"&appid=f3097fa7578a291cf093a4c518019b4e",
     
     ).on("data",(chunk)=>{
         const objdata=JSON.parse(chunk);
         console.log(objdata)
         const arrData=[objdata];
         //console.log(arrData[0].main.temp);
         const realTimeData=arrData.map(val=>replaceVal(homeFile,val)).join("");
         res.write(realTimeData);
        // console.log(realTimeData);
        
    }) 
    .on("end",(err)=>{
     if(err) return console.log("connection closed due to error");
     console.log("end");
     res.end();
    });
     
 });

 app.listen(8000,(req,res)=>{
    console.log("server started on port 8000")
 })

