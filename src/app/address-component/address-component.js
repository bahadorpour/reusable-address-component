/**
 * AddressComponent: A custom, reusable and encapsulated Component
 * Author: Mojdeh Bahadorpour
 */

var template = document.createElement('template');

// encapsulated markup of web component
template.innerHTML = `
<link type="text/css" rel="stylesheet" href="./app/address-component/address-component.css">
<base href="/">

<div class="container">
  <form name="addressForm" id="addressForm">
    <div>Addresse</div>

    <div class="row">
      <div class="col-25 col-style">
        <label for="zip">PLZ</label>
        <input id="zip" name="zip" type="text" maxlength="5" autocomplete="off">
        <label id="notFound"></label>

      </div>
      <div class="col-75 col-style">
        <label for="city">Stadt</label>
        <input id="city" name="city" type="text" readonly="">
      </div>
    </div>

    <div class="row">
      <div class="col-75 col-style">
        <label for="street">Strasse</label>
        <select id="street" name="street">
        </select>
      </div>
      <div class="col-25 col-style">
        <label for="houseNr">Hausnummer</label>
        <input id="houseNr" name="houseNr" type="text">
      </div>
    </div>

    <div class="row ">
      <div class="col-100 col-style">
        <label for="country">Land</label>
        <select id="country" name="country"> </select>
      </div>
    </div>

    <div class="row">
      <button type="submit" id="submit"> Info </button>
    </div>

  </form>
</div>
`;

class AddressComponent extends HTMLElement {
  constructor() {
    super();

    // encapsulate everythig to web component
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // binding methods
    this.setCountries = this.setCountries.bind(this);
  }

  // Called every time when the element is inserted into the DOM
  connectedCallback() {
    const addressForm = this.shadowRoot.querySelector('form#addressForm');
    const zipInput = this.shadowRoot.querySelector('#zip');
    const cityInput = this.shadowRoot.querySelector('#city');
    const streetSelect = this.shadowRoot.querySelector('#street');
    const notFoundLbl = this.shadowRoot.querySelector('#notFound');

    this.setCountries();

    // fetch data about zip code from postdirekt API
    zipInput.addEventListener('input', (e) => {
      e.preventDefault();
      if (e.target.value.length === 5) {
        const corsApiUrl = 'https://cors-anywhere.herokuapp.com/';
        const urlField = `https://www.postdirekt.de/plzserver/PlzAjaxServlet?finda=city&city=${zipInput.value}&lang=de_DE`;

        doRequest(corsApiUrl, urlField).then(
          ({ rows, count }) => {
            if (count !== 0) {
              const cityInfo = {
                _streets: [],
                _districts: [],
                set addStreet(street) {
                  this._streets.push(street);
                },
                set addDistrict(district) {
                  this._districts.push(district);
                },
                get streets() {
                  return this._streets;
                },
                get districts() {
                  return this._districts;
                }
              }
              // set city regards to zip code
              cityInput.value = rows[0].city;

              // set streets or districts regard to city name
              rows.forEach(row => {
                if (row.hasOwnProperty('street')) {
                  cityInfo.addStreet = row.street;
                }

                if (row.hasOwnProperty('district')) {
                  cityInfo.addDistrict = row.district;
                }
              });

              (cityInfo.streets.length ? cityInfo.streets : cityInfo.districts).forEach(element =>
                streetSelect.appendChild(createDropDownOption(element, element)));

              notFoundLbl.style.display = 'none';
            } else {
              notFoundLbl.style.display = 'block';
              notFoundLbl.innerText = `0 Suchtreffer für ${zipInput.value}`;
            }
          }, (err) => console.error(new Error("Can't load cities"))
        );
      } else {
        cityInput.value = '';
        streetSelect.options.length = 0;
        notFoundLbl.style.display = 'none';
      }
    });

    addressForm.addEventListener('submit', handleFormSubmit);

  }

  // Called every time when the element is removed from the DOM
  disconnectedCallback() {
    this.shadowRoot.querySelector('#zip').removeEventListener();
  }

  // Fetch countries from local JSON file
  setCountries(e) {
    const countrySelect = this.shadowRoot.querySelector('#country');
    const urlField = 'assets/countries.json';
    doRequest('', urlField).then(
      (countries) => {
        // const countries = JSON.parse(result);
        countries.forEach(info => countrySelect.appendChild(createDropDownOption(info.name)));

        // set 'Deutschland' as a default value for dropdown
        countrySelect.value = 'Deutschland';

      }, (err) => console.error(new Error(`Can't load countries`))

    );
  }
}

/**
 * doRequest: Connect to an API with/without CORS
 * (with Fetch API, supported by all browsers except IE11)
 */
const doRequest = async (corsApiUrl, url) => {
  return await fetch(corsApiUrl + url)
    .then((response) => response.json())//extract JSON from the http response
}

/**
 * doRequest: Connect to an API with/without CORS
 * (without Fetch API)
 */
/* const doRequest = (corsApiUrl, url) => {
  return new Promise((resolve, rejects) => {
    const api = corsApiUrl + url;
    const request = new XMLHttpRequest();
    request.open('GET', api);

    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        resolve(JSON.parse(request.response));
      } else {
        rejects(Error(request.statusText))
        alert(`It's not working! Try again`);
      }
    };
    request.onerror = (err) => rejects(err);
    request.send();
  });
} */

// get and convert  form field values to a JSON object
function handleFormSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.target);
  const formJSON = Object.fromEntries(data.entries());
  alert(`Address Information:
  ${JSON.stringify(formJSON)}`);
}


// Remove duplicate values from streets array
function uniq(streets) {
  return Array.from(new Set(streets));
}

// create opption elemnt for a dropdown
function createDropDownOption(name) {
  const option = document.createElement('option');
  option.value = name;
  option.text = name;
  return option;
}

// create custom HTML tag
window.customElements.define('app-address', AddressComponent);
