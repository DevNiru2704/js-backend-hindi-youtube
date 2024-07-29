import express from "express";
import cors from "cors"
const app=express();
const port=process.env.PORT || 3000;
// app.get("/",(req,res)=>{
//     res.send("Server is ready!")
// })
//If you get the CORs issue continuously, set the port to public in the codespace
app.use(cors())

app.get("/api/jokes",(req,res)=>{
    const jokes=[
        {
            id:1,
            content:"First Joke",
            title:"This is joke 1"
        },
        {
            id:2,
            content:"Second Joke",
            title:"This is joke 2"
        },
        {
            id:3,
            content:"Third Joke",
            title:"This is joke 3"
        },
        {
            id:4,
            content:"Fourth Joke",
            title:"This is joke 4"
        }
    ]
    res.send(jokes)
})

app.listen(port,()=>{
    console.log(`Serve at https://turbo-fiesta-jjj5wv5pw45vc5vv4-${port}.app.github.dev/`);
});
