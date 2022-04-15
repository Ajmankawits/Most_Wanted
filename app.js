/*
    Author: devCodeCamp
    Description: Most Wanted Starter Code
*/
//////////////////////////////////////////* Beginning Of Starter Code *//////////////////////////////////////////

"use strict";

/**
 * our user to decide whether to search by name or by traits.
 * @param {Array} people        A collection of person objects.
 */
function app(people) {
    // promptFor() is a custom function defined below that helps us prompt and validate input more easily
    // Note that we are chaining the .toLowerCase() immediately after the promptFor returns its value
    let searchType = promptFor(
        "Do you know the name of the person you are looking for? Enter 'yes' or 'no'",
        yesNo
    ).toLowerCase();
    let searchResults;
    // Routes our application based on the user's input
    switch (searchType) {
        case "yes":
            searchResults = searchByName(people);
            break;
        case "no":
            searchResults = searchByTraits(people);
            break;
        default:
            // Re-initializes the app() if neither case was hit above. This is an instance of recursion.
            app(people);
            break;
    }
    // Calls the mainMenu() only AFTER we find the SINGLE PERSON
    mainMenu(searchResults, people);
}
// End of app()

/**
 * @param {Object[]} person     A singular object inside of an array.
 * @param {Array} people        A collection of person objects.
 * @returns {String}            The valid string input retrieved from the user.
 */
function mainMenu(person, people) {
    // A check to verify a person was found via searchByName() or searchByTrait()
    if (!person[0]) {
        alert("Could not find that individual.");
        // Restarts app() from the very beginning
        return app(people);
    }
    let displayOption = prompt(
        `Found ${person[0].firstName} ${person[0].lastName}. Do you want to know their 'info', 'family', or 'descendants'?\nType the option you want or type 'restart' or 'quit'.`
    );
    // Routes our application based on the user's input
    switch (displayOption) {
        case "info":
            //! TODO #1: Utilize the displayPerson function //////////////////////////////////////////
            // HINT: Look for a person-object stringifier utility function to help
            let personInfo = displayPerson(person[0]);
            alert(personInfo);
            break;
        case "family":
            //! TODO #2: Declare a findPersonFamily function //////////////////////////////////////////
            // HINT: Look for a people-collection stringifier utility function to help
            let personFamily = findPersonFamily(person[0], people);
            displayPeople(personFamily);
            break;
        case "descendants":
            //! TODO #3: Declare a findPersonDescendants function //////////////////////////////////////////
            // HINT: Review recursion lecture + demo for bonus user story
            let personDescendants = findPersonDescendants(person[0], people);
            displayPeople(personDescendants);
            break;
        case "restart":
            // Restart app() from the very beginning
            app(people);
            break;
        case "quit":
            // Stop application execution
            return;
        default:
            // Prompt user again. Another instance of recursion
            return mainMenu(person, people);
    }
}
// End of mainMenu()

/**
 * This function is used when searching the people collection by
 * a person-object's firstName and lastName properties.
 * @param {Array} people        A collection of person objects.
 * @returns {Array}             An array containing the person-object (or empty array if no match)
 */
function searchByName(people) {
    let firstName = promptFor("What is the person's first name?", chars);
    let lastName = promptFor("What is the person's last name?", chars);

    // The foundPerson value will be of type Array. Recall that .filter() ALWAYS returns an array.
    let foundPerson = people.filter(function (person) {
        if (person.firstName === firstName && person.lastName === lastName) {
            return true;
        }
        else {
          return false;
        }
    });
    return foundPerson;
}
// End of searchByName()

/**

 * @param {Array} people        A collection of person objects.
 */
function displayPeople(people) {
    alert(
        people
            .map(function (person) {
                return `${person.firstName} ${person.lastName}`;
            })
            .join("\n")
    );
}
// End of displayPeople()

/**
 * This function will be useful for STRINGIFYING a person-object's properties
 * in order to easily send the information to the user in the form of an alert().
 * @param {Object} person       A singular object.
 */
function displayPerson(person) {
    let personInfo = `First Name: ${person.firstName}\n`;
    personInfo += `Last Name: ${person.lastName}\n`;
    personInfo += `Gender: ${person.gender}\n`;
    personInfo += `DOB: ${person.dob}\n`;
    personInfo += `Height: ${person.height} in.\n`;
    personInfo += `Weight: ${person.weight} lb.\n`;
    personInfo += `Eye Color: ${person.eyeColor}\n`;
    personInfo += `Occupation: ${person.occupation}\n`; 
    //! TODO #1a: finish getting the rest of the information to display //////////////////////////////////////////
    alert(personInfo);
}
// End of displayPerson()
function findPersonFamily(person, people) {
    let family = [];
    if (person.currentSpouse) {
      var spouse = people.filter(function(el) {
        return el.id === person.currentSpouse;
      });
      family.push(...spouse);
    }
  
    if (person.parents) {
      var parents = people.filter(function(el) {
        return person.parents.includes(el.id);
      });
      family.push(...parents);
    }
    else {
      return false;
    }
  
    var siblings = people.filter(function(el) {
        for (let parent of person.parents) {
            if (el.parents.includes(parent) && el !== person) {
          return true;
        }
      }
    });
    family.push(...siblings);
    return family;
  }
    


/**

 * First, to generate a prompt with the value passed in to the question parameter.
 * Second, to ensure the user input response has been validated.
 * @param {String} question     A string that will be passed into prompt().
 * @param {Function} valid      A callback function used to validate basic user input.
 * @returns {String}            The valid string input retrieved from the user.
 */
function promptFor(question, valid) {
    do {
        var response = prompt(question).trim();
    } while (!response || !valid(response));
    return response;
}
// End of promptFor()
function searchByTraits(people) {
    let chosenSearch = promptFor(
      "Are you looking for a single trait? Please enter: 'yes' or 'no'",
      yesNo
    ).toLowerCase();
    let Results, ChosenPerson;
    switch (chosenSearch) {
      case "yes":
        Results = searchBySingleTrait(people);
        
        ChosenPerson = searchConfirmation(Results, people);
        break;
      case "no":
        Results = searchByMultipleTraits(people);
        ChosenPerson = searchConfirmation(Results, people)
        break;
      default:
        searchByTraits(people);
        break;
    }
    mainMenu(ChosenPerson, people)
}

function searchBySingleTrait(people) {
    var trait = promptFor(
        `Enter trait to search for: \nOptions:\n${Object.keys(people[0]).slice(3,9).join('\n')}`,
        chars 
    );
    let traitValue = promptFor(`Enter trait ${trait}: `, chars);

    return filterBySingleTrait(people, trait, traitValue);
}

function filterBySingleTrait(people, traitID, traitValue) {
    return people.filter(function(el) {
      return el[traitID] == traitValue;
    });
}
  
function searchByMultipleTraits(people) {
    let traits = promptFor(
      `Enter traits to search with seperating each trait with a comma: \nOptions:\n${Object.keys(people[0]).slice(3,9).join('\n')}`,
      chars
    )
      
      .trim()
      .split(",");
    let ChosenTraits = [];
    for (let trait of traits) {
      let value = promptFor(`Please enter the ${trait}: `, chars);
      ChosenTraits.push(value);
    }
  
    
    let temp = people;
    for (let i = 0; i < traits.length; i++) {
      temp = filterBySingleTrait(temp, traits[i], ChosenTraits[i]);
    }
    return temp;
}
  
function searchConfirmation(results, people){
  
    displayPeople(results);
    let ChosenPerson = promptFor("Did you see the person you were searching for? 'yes' or 'no'", yesNo);
    if(ChosenPerson === "yes"){
      return searchByName(people);
    }
    else{
      return searchByTraits(people);
    }
  
  
    
}
  
/**
 
 * @param {String} input        A string that will be normalized via .toLowerCase().
 * @returns {Boolean}           The result of our condition evaluation.
 */
function yesNo(input) {
    return input.toLowerCase() === "yes" || input.toLowerCase() === "no";
}
// End of yesNo()
function findPersonDescendants(person, people) {
    let descendants = [];
  
    let children = people.filter(function(el) {
      
      return el.parents.includes(person.id);
    });
    descendants.push(...children);
  
    if (children.length > 0) {
      for (let child of children) {
        descendants.push(...findPersonDescendants(child, people));
      }
    } else {
      return descendants;
    }
    return descendants;
}
/**
 
 * Feel free to modify this to suit your needs.
 * @param {String} input        A string.
 * @returns {Boolean}           Default validation -- no logic yet.
 */
function chars(input) {
    return true; // Default validation only
}
// End of chars()

//////////////////////////////////////////* End Of Starter Code *//////////////////////////////////////////
// Any additional functions can be written below this line 👇. Happy Coding! 😁
//function traitType(input) {
    //const relevantTraits = 'gender;dob;height;weight;eyeColor;occupation'.split(';');
    //return relevantTraits.includes(input);
  //}

// Add comments - Do user functionality
