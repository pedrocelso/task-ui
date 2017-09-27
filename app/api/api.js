import request from 'superagent-bluebird-promise'

// TODO: get this from env
// const baseUrl = `http://localhost:8080/`
const baseUrl = `https://api-dot-go-rest-service.appspot.com/`
const apiVersion = `v1/`
const usersEndpoint = `users/`

export const getUrl = (endpoint) => {
  return `${baseUrl}${apiVersion}${endpoint}`
}

export const usersService = {
  getUsers: function() {
    const url = getUrl(usersEndpoint)
    return request.get(url)
    .set(`Access-Control-Allow-Origin`, `*`)
    .then((response) => response.body)
    .catch((e) => console.log(e))
  },
  getUser: function(userEmail) {

  },
  createUser: function({email, name}) {

  },
  updateUser: function({email, name}) {

  },
  deleteUser: function(userEmail) {

  }
}
