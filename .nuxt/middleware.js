const middleware = {}

middleware['authenticated'] = require('..\\middleware\\authenticated.js')
middleware['authenticated'] = middleware['authenticated'].default || middleware['authenticated']

middleware['sockjs'] = require('..\\middleware\\sockjs.js')
middleware['sockjs'] = middleware['sockjs'].default || middleware['sockjs']

middleware['vue-i18n'] = require('..\\middleware\\vue-i18n.js')
middleware['vue-i18n'] = middleware['vue-i18n'].default || middleware['vue-i18n']

export default middleware
