// LoadFromJSON Example
// Source code file: script.js

//create array to save the answers
var answerArray=[];
var contents;
var questionLength=0;
var score=0;

function loadRiddles(event) {

    // Obtain the single uploaded file.
    var f = event.target.files[0]; 
    if (f) {
        var r = new FileReader( );
        r.onload = function(e) { 
            contents = e.target.result;
        }
        r.readAsText(f);
    }
    else { 
        alert("Failed to load file");
    }
}

function displayRiddles( ) {

    // Convert JSON data to array of objects.
    var riddlesArray = JSON.parse(contents);
    questionLength=riddlesArray.length;
    //loop through all target questions
    for(var i=0;i<riddlesArray.length;i++)
    {
        var questionNode=document.createElement("div");
        questionNode.id=`q-${i+1}`;
        questionNode.className="question";

        questionNode.innerHTML=`<div class="box-header">
                        <div class="item image" id="image-${i+1}">
                        </div>
                        <div class="item points">
                        <span class="points">20 points</span>
                        </div>
                    </div>
                <p><b> ${riddlesArray[i]["riddle"]}</b></p>`
                for(var j=0;j<riddlesArray[i]["options"].length;j++)
                {
                    questionNode.innerHTML+=`
                    <input type="radio" name="question-${i+1}" value="${j}" onclick="markOption(this)">
                    <label for="${riddlesArray[i]["options"][j]}">${riddlesArray[i]["options"][j]}</label><br>`
                }
                questionNode.innerHTML+=
                    `<button class="show-hint" onclick="showHint(this)">Show Hint</button>
                    <span class="hint" id="hint-${i+1}">${riddlesArray[i]["hint"]}</span>`
        document.getElementById("questions").appendChild(questionNode);
    }
    document.getElementById("result-button").style.display="block";
}

// Attach event handlers.
function init( ) {

    // Upload file synchronously.
    document.getElementById("in1").
    addEventListener("change", 
    loadRiddles, false);

    // Attach event handler to button
    document.getElementById("btn1").
    addEventListener("click", displayRiddles);
    //add event handler for modal
    loadModalEvents();
}
window.addEventListener("load", init);

function markOption(node)
{
    //get Question Number
    var questionNumber=node.parentElement.id.split('-')[1];
    var markedOption=node.value;
    var question=getQuestion(questionNumber);
    var correctOption=question["correctOption"];
    var correctStatement=question["options"][correctOption];

    var index = answerArray.findIndex(element => element.id ==questionNumber);
    if(index>=0)
    {
        answerArray[index]["markedOption"]=markedOption;
        if(answerArray[index]["markedOption"]==answerArray[index]["correctStatement"])
        {
            answerArray[index]["isCorrect"]=true;
        }
        else{
            answerArray[index]["isCorrect"]=false;
        }
    }
    else{
        var answer={
            "id":questionNumber,
            "correctOption":correctOption,
            "markedOption":parseInt(markedOption),
            "correctStatement":correctStatement
        }
        if(answer["markedOption"]==answer["correctOption"])
        {
            answer.isCorrect=true;
        }
        else{
           answer.isCorrect=false; 
        }
        answerArray.push(answer);
    }    
   
}

function showHint(node)
{
    //get parent div to get question number
    var questionNumber=node.parentElement.id.split('-')[1];
    //display the hint
    document.getElementById(`hint-${questionNumber}`).style.display="block";
}
//get question of a particular id
function getQuestion(id)
{
    var riddlesArray = JSON.parse(contents);
    const found = riddlesArray.find(element => element.id == id);
    return found;
}
//sort the arrayof answers
function compare( a, b ) {
  if ( a.id < b.id ){
    return -1;
  }
  if ( a.id > b.id ){
    return 1;
  }
  return 0;
}

//function to display result
function displayResult(){
    answerArray.sort( compare ); 
    var tableContent=document.createElement("table");
    tableContent.id='quiz-data';
    console.log("here");
    tableContent.innerHTML=`
                                <thead>
                                <tr>
                                <th>#</th>
                                <th>Marked Option</th>
                                <th>Correct Option</th>
                                <th>Corret Answer</th>
                                <th>Points Scored</th>
                                </tr>
                                </thead>
                            `
    var contentBody=document.createElement("tbody");

    var riddlesArray = JSON.parse(contents);
    var i=0;
    var answerPtr=0;
    while(i< riddlesArray.length)
    {
        if(answerPtr<answerArray.length && answerArray[answerPtr]["id"]==riddlesArray[i]["id"] )
        {
            var tableRow=document.createElement("tr");
            tableRow.innerHTML=`<td>${answerArray[answerPtr]["id"]}</td>
                                <td>${answerArray[answerPtr]["markedOption"]+1}</td>
                                <td>${answerArray[answerPtr]["correctOption"]+1}</td>
                                <td>${answerArray[answerPtr]["correctStatement"]}</td>`
            if(answerArray[answerPtr]["isCorrect"])
            {
                var image=document.createElement("img");
                image.src="Images/tick.png";
                document.getElementById(`image-${riddlesArray[i]["id"]}`).innerHTML="";
                
                document.getElementById(`image-${riddlesArray[i]["id"]}`).appendChild(image);
                tableRow.innerHTML+=`<td>20</td>`
                score+=20;
            }
            else{
                var image=document.createElement("img");
                image.src="Images/close.png";
                document.getElementById(`image-${riddlesArray[i]["id"]}`).innerHTML="";
                
                document.getElementById(`image-${riddlesArray[i]["id"]}`).appendChild(image);
                tableRow.innerHTML+=`<td>0</td>`
            }
            contentBody.appendChild(tableRow);
            answerPtr++;
            i++;
        }
        else{
            var tableRow=document.createElement("tr");
            tableRow.innerHTML+=`<tr><td>${riddlesArray[i]["id"]}</td>
                                <td>None</td>
                                <td>${riddlesArray[i]["correctOption"]+1}</td>
                                <td>${riddlesArray[i]["options"][riddlesArray[i]["correctOption"]]}</td>
                                <td>0</td></tr>`
            contentBody.appendChild(tableRow);
            var image=document.createElement("img");
            image.src="Images/close.png";
                document.getElementById(`image-${riddlesArray[i]["id"]}`).innerHTML="";
            
            document.getElementById(`image-${riddlesArray[i]["id"]}`).appendChild(image);
            i++;
        }
        tableContent.appendChild(contentBody)

    }
     document.getElementById("result-table").innerHTML="";
        var close=document.createElement("span")
            close.innerHTML="&times";
            close.className="close";

    document.getElementById("result-table").appendChild(close);
    loadModalEvents();
    
    var scoreHeading=document.createElement("h2");
    
    scoreHeading.innerHTML=`Score ${score}/${20*questionLength}`;
    document.getElementById("result-table").appendChild(scoreHeading);

    document.getElementById("result-table").appendChild(tableContent)
    
    //open modal which contains result
    openModal();

    //disable all the radio buttons
    var radios = document.querySelectorAll("input[type=radio]");
    for(var i=0;i<radios.length;i++)
    {
        radios[i].disabled = true;
    } 
}


function openModal()
{
    var modal = document.getElementById("userDetails");
    modal.style.display = "block";

}
function loadModalEvents(){
    var modal = document.getElementById("userDetails");
    window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        }
    }
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
    modal.style.display = "none";    
    }
    
}