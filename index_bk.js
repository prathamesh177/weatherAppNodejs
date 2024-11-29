const http=require("http");
const fs=require("fs");
var requests=require("requests");

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

const server=http.createServer((req,res)=>{
    
    if(req.url="/"){
       requests(
        "https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=cab4ee95ba04cbf9117a43d5c7b1110f",
        
        ).on("data",(chunk)=>{
            const objdata=JSON.parse(chunk);
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
        
    }
});

server.listen(8000, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", 8000);
})
