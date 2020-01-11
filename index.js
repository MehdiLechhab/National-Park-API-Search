'use strict';

// put your own value below!
const apiKey = 'oeowIrOmkbrncfW3y4FMm5uS2224sHnYqBIfDFT6'; 
const searchURL = 'https://api.nps.gov/api/v1/parks';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.data.length; i++){
    
    $('#results-list').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <a href='${responseJson.data[i].url}'>${responseJson.data[i].fullName}</a>
      </li>`
    )};
  //display the results section  
  $('#results').removeClass('hidden');
};

function getPark(statesGiven, limit=10) {
  const params = {
    key: apiKey,
    stateCode: statesGiven,
    limit
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const statesGiven = $('#js-search-term').val().split(", ");
    const maxResults = $('#js-max-results').val();
    if (maxResults >= 1) {
      getPark(statesGiven, maxResults);
    } else {
      $('#js-error-message').text(`Negative number not accepted. Please put a positive number.`);
    }
    
  });
}

$(watchForm);