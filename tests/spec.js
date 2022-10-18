let ins = require("../dist/index").init();
let db = ins();

// Methods (everything should be true)

console.log("Setting Data:", db.set("myNumber", 100) === 100);
console.log("Fetching Data:", db.get("myNumber") === 100);

console.log("Subtracting Numbers:", db.all());

console.log("Adding Numbers:", db.add("myNumber", 100) === 200);
console.log("Subtracting Numbers:", db.subtract("myNumber", 50) === 150);

db.set("myData", "_");
console.log("Deleting Data:", db.delete("myData"));
console.log("Fetching Deleted Data:", db.get("myData") === null);

console.log("Fetching Added Number:", typeof db.get("myNumber") === "number");
console.log("Pushing to an array:", db.push("myVal", "val") instanceof Array);
console.log("Fetching first prop of array:", db.get("myVal.0") === "val");

console.log("Setting prop in object:", db.set("myObj.prop", "myProp").prop === "myProp");
console.log("Fetching prop in object:", db.get("myObj.prop") === "myProp");
console.log("Deleting prop in object:", db.delete("myObj.prop"));
console.log("Fetching deleted prop:", db.get("myObj.prop") === null);

console.log("Pushing in array in object:",db.push("myObj.arr", "myItem").arr instanceof Array);

console.log("Clearing db:", db.clear() == 3)
console.log("Fetching Data After cleared:", db.get("myData") === null);

