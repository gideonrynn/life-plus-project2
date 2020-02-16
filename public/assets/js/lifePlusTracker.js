$(function () {

// *** moment.js todayDate to return to page *** //
const date = moment().format("MMMM Do, YYYY");
$("#todayDate").text(date);

// create waterAmountVal to store future water amount in array
let waterAmountVal = "";

//set variable for total number of toggles
const toggleVal = 6;
//set variable for number of toggles that have been clicked (true)
let toggleCountNow = 0;
//run for each function to collect the true status of all toggles


//when page loads and database returns values, check data statue values and apply checked or unchecked 
function activeToggle() {
    $('label .userInput[data-status=true]').each(function(){
        $(this).attr("checked");
    
     }) 
     $('label .userInput[data-status=false]').each(function(){
        $(this).removeAttr("checked");
     }) 

}

//**Note: flipped if else true false to match .active button behavior. active state check may cause lag with buttons
// when any of the buttons with class .btn-group-toggle are clicked
$('.btn-group-toggle').on('click', function () {

    //and if the label of the particular toggle that was clicked is 'active'
    if ($(this).find('label').hasClass('active')) {
      
        //set data datastatus to false and remove checked
        $(this).find('input').attr("data-status", false).removeAttr("checked");

    } else {

        //set data datastatus to true and add checked
        $(this).find('input').attr("data-status", true).attr("checked");
    }

});

// *** return and store waterAmount:""; from html *** //
$("#waterAmount").on("change", function() {
    const waterAmountClick = $(this);
    console.log(waterAmountClick);
    const waterAmountVal = waterAmountClick[0].value;
    // console.log(waterAmountVal);
    $(this).attr("waterAmount", waterAmountVal);
});

// *** submit button click event PUT functions *** //
$("#dailySubmitBtn").click(function() {
// set var for today's date in SQL table format
    let todayDatePUTReq = moment().format('YYYY-MM-DD');

    //**add user water oz input to current water intake total
    //set variables for amount entered by user into "how many ounces" box and running total
    let waterAmountInput = parseInt($("#waterAmount").attr("wateramount")) || 0;
    let waterAmountTotal = parseInt($("#waterTrackerBar").text());

    let newTotalAmount = waterAmountInput + waterAmountTotal;

    // create api PUT request array
    const apiPutObj = {
        water: $("#water").attr('data-status'),
        waterAmount: newTotalAmount,
        meditation: $("#meditation").attr('data-status'),
        pills: $("#pills").attr('data-status'),
        interaction: $("#interaction").attr('data-status'),
        goal: $("#goal").attr('data-status'),
        food: $("#food").attr('data-status')
    };

// PUT api call returning userInput data to SQL table
    $.ajax("/api/progress/" + todayDatePUTReq, {
        type: "PUT",
        data: apiPutObj
    }).then(function() {
    
        location.reload();
    })
});    

// *** inspirational quotes third party api call *** //
$.ajax({
    url: "https://type.fit/api/quotes",
    method: "GET"
}).then(function(quotesDataRaw) {
    
    const quotesDataParsed = JSON.parse(quotesDataRaw);
 
    const randomIndex = Math.floor(Math.random() * 1001)

    const quote = quotesDataParsed[randomIndex].text;
   
    const author = quotesDataParsed[randomIndex].author;
    $("#quotesApiQ").text(quote);
    $("#quotesApiA").text(author); 
    
}); 

// *** Progress Bar Update *** //
//code below to update the progress bar in percentages

    $('.userInput[data-status=true]').each(function() {
        toggleCountNow++;
    })
    //set var that will hold percentage
    const todaysProgress = ((toggleCountNow / toggleVal) * 100) + "%";
    //add percentage to progress bar div
    $("#dailyTrackerBar").attr('style', 'width:' + todaysProgress)
    console.log($("#waterTrackerBar").text())

// *** healthboi state change *** //
// changes from img to gif at todaysProgress = 100%
    const healthboiSuccessURL = "/assets/images/healthboi1gif.gif"
    if (todaysProgress === "100%" ) {
        // console.log("sparkleboi!")
        $("#sparkleboi").attr("src", healthboiSuccessURL)
    };

    activeToggle();

});