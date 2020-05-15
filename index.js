const hbase = require('hbase')
const xml2js = require('xml2js');
const fs = require('fs');
const parser = new xml2js.Parser({});

let xml_string = fs.readFileSync("freeformatter-out.xml", "utf8");
client = hbase({ host: '127.0.0.1', port: 6789})



parser.parseString(xml_string, function(error, result) {
    if(error === null) {

        const myArray = result.Food_Display_Table.Food_Display_Row
        for (idx in myArray) {
            console.log(idx)
            Object.keys(myArray[idx]).map(function(key, index) {
                myArray[idx][key] = myArray[idx][key][0];
            });
            
            myCells = []

            for (let [key, value] of Object.entries(myArray[idx])) {
                const currCell = {}
                currCell.column = `cf:${key}`
                currCell['$'] = value
                myCells.push(currCell)
            }

            client
            .table('Food_Display_Table')
            .row(idx)
            .put(myCells, (error, success) => {
                console.log(error, success)

            })
        }
    }
    else {
        
    }
});

