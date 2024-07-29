const express=require("express");

const app=express();
const port=3000;

app.get("/",(req,res)=>{ //req=request, res=response
    res.send("Congratulations you have made your first server!!")
})

app.get("/twitter",(req,res)=>{
    res.send("nirmalyadotcom")
})

app.get("/youtube",(req,res)=>{
    res.send("youtube custom")
})

app.get("/json-testing",(req,res)=>{
    res.json(
        {
            "name": "demochaibackend",
            "version": "1.0.0",
            "description": "a basic app to deploy",
            "main": "index.js",
            "scripts": {
            "start": "node index.js"
            },
            "keywords": [
            "node",
            "chai"
            ],
            "author": "nirmalya mandal",
            "license": "ISC",
            "dependencies": {
            "express": "^4.19.2"
            }
      }
    )
})

app.listen(port, ()=>{
    console.log(`Example app listening on port ${port}`);
    console.log("Congratulations you have made your first server!!")
})