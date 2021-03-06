const db = require("../models");
const moment = require('moment');

module.exports = function(app) {

    //executes get to retrieve data from db and post for adding new data to db
   app.get("/", function(req, res) {

    //set var for today's date
    let todaysDate = moment().format('YYYY-MM-DD');

    //run method that will search for an existing record, and if it does not exist will create it
    db.Intake.findOrCreate({

        //find the record where the date equals today
        where: { 
            createdAt: todaysDate 
        },
        //if it doesn't exist, create it
        defaults: { 
            water: 0 
        } 

        }).then(function(data) {

            //set var to parsed data obj
            let dataObj = data[0].dataValues;

        //render the index and send parsed data to client
        res.render("index", { dataObj } );

        });

    });



    //execute put to update existing record with new data in db based on today's date
    app.put("/api/progress/", function(req, res) {

        //*note - originally, the todaysDate was passed into the put request as a parameter. Moment was moved to apiroute, as there was a discrepancy between the date being sent by the browser, and the date saved on the server side for updating an existing record
        //set var for today's date returned from the put request
        // let todaysDate = req.params.todaysDate;

        //set var for today's date
        let todaysDate = moment().format('YYYY-MM-DD');
        
        //use the data sent from the browser (req.body) to update the specific row...
        db.Intake.update(req.body,
            
            {
            //...that matches today's date
          where: {
            createdAt: todaysDate
          }

        }).then(function(data) {

            //   console.log(data);

            //send data back to the client
            res.json(data);

        });

    });

};