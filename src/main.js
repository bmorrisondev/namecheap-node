const domains = require('./modules/domains')
const records = require('./modules/records')

class NamecheapClient {
  constructor(apiUser, apiKey, clientIp) {
      this.apiUser = apiUser
      this.apiKey = apiKey
      this.clientIp = clientIp
      this.baseUrl = "https://api.namecheap.com/xml.response?"
      this.baseUrl += `ApiUser=${this.apiUser}&`
      this.baseUrl += `UserName=${this.apiUser}&`
      this.baseUrl += `ApiKey=${this.apiKey}&`
      this.baseUrl += `ClientIp=${this.clientIp}`
  }

  async getDomains() {
    return await domains.getDomains(this.baseUrl);
  }

  async getRecords(domain) {
    return await records.getRecords(this.baseUrl, domain)
  }

  async addRecord(domain, name, type, address, mxPref, ttl) {
    return await records.addRecord(this.baseUrl, domain, name, type, address, mxPref, ttl)
  }
}

module.exports = {
  NamecheapClient
}