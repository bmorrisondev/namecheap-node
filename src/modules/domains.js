const axios = require('axios')
const xml2js = require('xml2js')

function getDomains(baseUrl) {
  return new Promise((resolve, reject) => {
    axios.get(baseUrl + `&Command=namecheap.domains.getList`)
    .then(response => {
      return xml2js.parseStringPromise(response.data)
    })
    .then(data => {
      var parsedResponse = data.ApiResponse.CommandResponse[0].DomainGetListResult[0].Domain.map(el => el['$'])
      resolve(parsedResponse)
    })
    .catch(err => reject(err));
  }) 
}

module.exports = {
  getDomains
}