module.exports = {
    api: {
        bodyParser: {
          sizeLimit: '5mb',
        },
    },
    serverRuntimeConfig: {
        secret: 'b74dad4c02dff8006a8f00826eceef96'
    },
    publicRuntimeConfig: {
        apiUrl: process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000/api' // development api
            : 'https://eduvanz-api.herokuapp.com/api' // production api
    }
}
