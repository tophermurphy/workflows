$ = require 'jquery'

do fill = (item = 'The most Creative minds in Art') ->
  $('.tagline').append "#{item}"
fill