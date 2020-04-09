const axios = require('axios')
const xml2js = require('xml2js')

function getRecords(baseUrl, domain) {
  return new Promise((resolve, reject) => {
    var url = baseUrl + `&Command=namecheap.domains.dns.getHosts`
    url += `&tld=${domain.split('.')[1]}`
    url += `&sld=${domain.split('.')[0]}`
    axios.get(url)
      .then(response => {
        return xml2js.parseStringPromise(response.data)
      })
      .then(data => {
        if(data.ApiResponse && 
          data.ApiResponse.Errors &&
          data.ApiResponse.Errors[0] != "") {
            console.log(JSON.stringify(data.ApiResponse.Errors));
            var errors = data.ApiResponse.Errors.map(err => err.Error)
            reject(errors)
        }
        var parsedResponse = data.ApiResponse.CommandResponse[0].DomainDNSGetHostsResult[0].host.map(el => el['$'])
        resolve(parsedResponse)
      })
      .catch(err => reject(err));
  }) 
}

function addRecord(baseUrl, domain, name, type, address, mxPref, ttl) {
  return new Promise((resolve, reject) => {
    let newRecord = {
      Name: name,
      Type: type, 
      Address: address
    }
    if(mxPref) {
      newRecord.MXPref = mxPref
    }
    if(ttl) {
      newRecord.TTL = ttl
    }

    getRecords(baseUrl, domain) 
      .then(records => {
        records.push(newRecord)
        
        var url = baseUrl + `&Command=namecheap.domains.dns.setHosts`
        url += `&tld=${domain.split('.')[1]}`
        url += `&sld=${domain.split('.')[0]}`

        let i = 0
        records.forEach(r => {
          i++
          url += `&HostName${i}=${r.Name}`
          url += `&RecordType${i}=${r.Type}`
          url += `&Address${i}=${r.Address}`
          if(r.Type === "MX") {
            url += `&MXPref${i}=${r.MXPref}`
          }
          if(r.TTL) {
            url += `&TTL${i}=${r.TTL}`
          }
        })
        return axios.post(url)
      })
      .then(response => {
        return xml2js.parseStringPromise(response.data)
      })
      .then(data => {
        if(data.ApiResponse && 
          data.ApiResponse.Errors &&
          data.ApiResponse.Errors[0] != "") {
            console.log(JSON.stringify(data.ApiResponse.Errors));
            var errors = data.ApiResponse.Errors.map(err => err.Error)
            reject(errors)
        }
        resolve();
      })
      .catch(err => reject(err));
  })
}

module.exports = {
  getRecords,
  addRecord
}