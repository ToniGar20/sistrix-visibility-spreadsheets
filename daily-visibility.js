/**
 * CONSTANTS
 */
const APIKEY = 'YOUR_APIKEY_GOES_HERE';
const HEADERS = {
  'User-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
  'Accept': '*/*',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive'
};
const DOMAIN_VISIBILITY = `https://api.sistrix.com/domain.sichtbarkeitsindex?format=json&api_key=${APIKEY}&mobile=true&domain=`;
const HOST_VISIBILITY = `https://api.sistrix.com/domain.sichtbarkeitsindex?format=json&api_key=${APIKEY}&mobile=true&host=`;

/**
 * DEFINED FUNCTIONS
 */

// Date parse to YYYY-MM-DD
function convertDate(date) {
  let yyyy = date.getFullYear().toString();
  let mm = (date.getMonth()+1).toString();
  let dd  = date.getDate().toString();

  let mmChars = mm.split('');
  let ddChars = dd.split('');

  return yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);
}

// Fetch of Sistrix's API endpointS
function sistrixApiFetch(url) {
  let response = UrlFetchApp.fetch(url, {
      method: 'GET',
      headers: HEADERS,
      mode: "no-cors"
  }).getContentText()

  return response;
}

// Data parse to JSON and reading visibility value
function sistrixDataProcessing(a) {
  let parsedResponse = JSON.parse(a)
  let visibilityValue = Math.round((parsedResponse.answer[0].sichtbarkeitsindex[0].value) * 100) / 100;
  Logger.log(visibilityValue);
  return visibilityValue;
}


/**
 * VISIBILITY VALUE FUNCTIONS FOR GOOGLE SPREADSHEET
 * Today, yesterday, week over week, month over month and year over year values 
 */

function todayVisibility(host){
  let hostHolder = host.split(".")
  let country = hostHolder[hostHolder.length - 1].split("/")[0];

  let visibilityUrl;

  if(hostHolder.length == 2){
    visibilityUrl = DOMAIN_VISIBILITY + `${host}&country=${country}`;
    Logger.log(visibilityUrl);
  } else {
    visibilityUrl = HOST_VISIBILITY + `${host}&country=${country}`;
    Logger.log(visibilityUrl);
  }

  let data = sistrixApiFetch(visibilityUrl);
  return sistrixDataProcessing(data);

}


function yesterdayVisibility(host) {
  let hostHolder = host.split(".");
  let country = hostHolder[hostHolder.length - 1].split("/")[0];

  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  let yesterdayDate = convertDate(yesterday);

  let visibilityUrl;

  if(hostHolder.length == 2){
    visibilityUrl = DOMAIN_VISIBILITY + `${host}&country=${country}&date=${yesterdayDate}`;
  } else {
    visibilityUrl = HOST_VISIBILITY + `${host}&country=${country}&date=${yesterdayDate}`;
  }

  let data = sistrixApiFetch(visibilityUrl);
  return sistrixDataProcessing(data);

}

function wowVisibility(host) {
  let hostHolder = host.split(".");
  let country = hostHolder[hostHolder.length - 1].split("/")[0];

  let previousWeekDay = new Date();
  previousWeekDay.setDate(previousWeekDay.getDay() - 7);
  let previousWeekDate = convertDate(previousWeekDay);

  let visibilityUrl;

  if(hostHolder.length == 2){
    visibilityUrl = DOMAIN_VISIBILITY + `${host}&country=${country}&date=${previousWeekDate}`;
  } else {
    visibilityUrl = HOST_VISIBILITY + `${host}&country=${country}&date=${previousWeekDate}`;
  }

  let data = sistrixApiFetch(visibilityUrl);
  return sistrixDataProcessing(data);
}

function momVisibility(host) {
  let hostHolder = host.split(".");
  let country = hostHolder[hostHolder.length - 1].split("/")[0];

  let previousMonthDay = new Date();
  previousMonthDay.setMonth(previousMonthDay.getMonth() - 1);
  let previousMonthDate = convertDate(previousMonthDay);

  let visibilityUrl;

  if(hostHolder.length == 2){
    visibilityUrl = DOMAIN_VISIBILITY + `${host}&country=${country}&date=${previousMonthDate}`;
  } else {
    visibilityUrl = HOST_VISIBILITY + `${host}&country=${country}&date=${previousMonthDate}`;
  }

  let data = sistrixApiFetch(visibilityUrl);
  return sistrixDataProcessing(data);
}

function yoyVisibility(host) {
  let hostHolder = host.split(".");
  let country = hostHolder[hostHolder.length - 1].split("/")[0];

  let previousYearDay = new Date();
  previousYearDay.setDate(previousYearDay.getDay() - 365);
  let previousYearDate = convertDate(previousYearDay);

  let visibilityUrl;

  if(hostHolder.length == 2){
    visibilityUrl = DOMAIN_VISIBILITY + `${host}&country=${country}&date=${previousYearDate}`;
  } else {
    visibilityUrl = HOST_VISIBILITY + `${host}&country=${country}&date=${previousYearDate}`;
  }

  let data = sistrixApiFetch(visibilityUrl);
  return sistrixDataProcessing(data);
}
