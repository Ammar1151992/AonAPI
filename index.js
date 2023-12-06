
const express = require('express')
const fs = require("fs");
const app = express()
const port = 3000

app.use(express.json());

const readingFile = () => {
  try {
    const file = fs.readFileSync("./users.json", "utf8");
    const usersFile = JSON.parse(file)
    return usersFile;       
  } catch (error) {
    console.log(error);
  }
}

let list = readingFile();


app.get("/api/items/:dynamicFliter", (req, res) => {

   function searchNestedObject(obj, input){
    for(const key in obj){
      if(typeof(obj[key]) === "string" && obj[key].toLowerCase().includes(input)){
        console.log("first", obj[key]);
        return res.send(obj[key])
      } 
      }
    }

  let dataInput = req.params.dynamicFliter;

  if(!isNaN(dataInput)){
    let filterItem = list.find(el => el.id === +dataInput)
    if(filterItem){
      res.send(filterItem)
      return 
    }else{
      res.send("Not match data! tray again")
      return 
    }
    
  }else {
    let input = dataInput.toLowerCase();
    for(const user of list){
      for(const key in user){
        if(typeof(user[key]) === "string" && user[key].toLowerCase().includes(input)){
         res.send(user[key]);
         return
        }else if(typeof(user[key]) === "object"){
           searchNestedObject(user[key], input)
        } 
      }
    }
   
    }
 res.send("Not match data! tray again");
})


// Add items
app.post("/api/items", (req, res) => {
    let newItem = req.body;
    let addItem = [...list, newItem];
    try {
      fs.writeFileSync("./users.json", JSON.stringify(addItem))
      res.json("addess successfully")
    } catch (error) {
      console.log(error);
    }
     
})

// Edit item
app.put("/api/items/:id", (req, res) => {
  let id = req.params.id;
  let data = req.body;
  const index = list.findIndex(i => i.id === +id);
  if(index != -1){
    list[index] = [{id: id, ...data}]
    fs.writeFileSync("./users.json", JSON.stringify(list))
    res.json("edit successfully")
  }else{
    res.status(404).json({ error: 'Item not found' });
  }
})

app.delete("/api/items/:id", (req, res) => {
  let id = req.params.id;
  const delet = list.filter(i => i.id !== +id);
  if(delet){
    let newData = [...delet]
    fs.writeFileSync("./users.json", JSON.stringify(newData))
    res.json("deleted successfully")
  }else{
    res.status(404).json({ error: 'Item not found' });
  }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})