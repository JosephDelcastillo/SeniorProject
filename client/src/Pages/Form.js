import React from 'react'

/**
 * Form THELAKJDHASKFJLAJFPage 
 * @returns {React.Component} 
 */
function Form() {
    return (
        <div id = "subForm">   

        <div id="Top">
            <head><link rel="stylesheet" href=""></link></head>
            <title id="Welcome">Form Submission</title>
            <h1>Education Update Form</h1>
        </div>

        <div id = "Middle">

            <form action="" method="post">
                <h3>Please Fill in the following fields.</h3>
                    <label for = "fname">First Name: </label><input type = "text" id = "fname" name ="First_Name"></input><br></br> 	
                    <label for = "fname">Last Name: </label><input type = "text" id = "lname" name ="Last_Name"></input><br></br>

                <label for = "volunteerNum"><h4>How many new Volunteers did you work with this stretch?</h4><br></br>
                
                    <label for volunteerNum1><input type = "radio" id = "volunteerNum1" name = "Volunteer_Number" value = "1"></input>1+ New Volunteers</label><br></br>
                    <label for volunteerNum5><input type = "radio" id = "volunteerNum5" name = "Volunteer_Number" value = "5"></input>5+ Volunteers</label><br></br>

                    <label for volunteerNum10><input type = "radio" id = "volunteerNum10" name = "Volunteer_Number" value = "10"></input>10+ Volunteers</label><br></br>
		            <label for volunteerNum15><input type = "radio" id = "volunteerNum15" name = "Volunteer_Number"	value = "15"></input>15+ Volunteers</label><br></br>
                
                </label>

                    <label id = "checkArea" class = "container"><h4>Check the following boxes to express diversity in volunteers.</h4><br></br> 
                    <label for = "caucasian"><span class = "checkmark"> Caucasian </span><input type = "checkbox" id = "caucasian" value = "white"></input></label><br></br>
                    <label for = "black"><span class = "checkmark"> African-American </span><input type = "checkbox" id = "black" value = "black"></input></label><br></br>
            	    <label for = "asian"><span class = "checkmark"> Asian-American </span><input type = "checkbox" id = "asian" value = "asian"></input></label><br></br>
                    <label for = "native"><span class = "checkmark"> Native-American </span><input type = "checkbox" id = "native" value = "native"></input></label><br></br>
                    <label for = "european"><span class = "checkmark"> European </span><input type = "checkbox" id = "european" value = "european"></input></label><br></br>
                    <label for = "south-american"><span class = "checkmark"> South-American </span><input type = "checkbox" id = "south-american" value = "south-american"></input></label><br></br>
                    <label for = "other"><span class = "checkmark"> Other </span><input type = "checkbox" id = "other" value = "other"></input></label><br></br>

                </label>

                <label for = "StudentNum"><h4>How many new Students did you work with this stretch?</h4><br></br>
                
                    <label for studentNum1><input type = "radio" id = "studentNum1" name = "Student_Number" value = "1"></input>1+ New Students</label><br></br>
                    <label for studentNum5><input type = "radio" id = "studentNum5" name = "Student_Number" value = "5"></input>5+ Students</label><br></br>

                    <label for studentNum10><input type = "radio" id = "studentNum10" name = "Student_Number" value = "10"></input>10+ Students</label><br></br>
                    <label for studentNum15><input type = "radio" id = "studentNum15" name = "Student_Number"	value = "15"></input>15+ Students</label><br></br>
            
                </label>
                <br></br>
                <br></br>
                <br></br>
                <label for = "submit">
                    <input type = "submit" id = "submit" value = "Submit Resposnse Form"></input>

                </label>
                <label for = "reset">
                    <input type = "reset" id = "reset" value = "Reset Resposnse Form"></input>

                </label>
            </form> 

        </div>
    
    
    </div>
    )
}

export default Form