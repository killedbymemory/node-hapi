var Products = require('./handlers/products');
var Categories = require('./handlers/categories');

module.exports = [
  {
    method: 'GET',
    path: '/products',
    handler: Products.find
  },
  {
    method: 'GET',
    path: '/products/{id}',
    handler: Products.findOne
  },
  {
    method: 'POST',
    path: '/products',
    handler: Products.create
  },
  {
    method: 'PUT',
    path: '/products',
    handler: Products.update
  },
  {
    method: 'DELETE',
    path: '/products/{id}',
    handler: Products.remove
  },

  {
    method: 'GET',
    path: '/categories',
    handler: Categories.find
  },
  {
    method: 'GET',
    path: '/categories/{id}',
    handler: Categories.findOne
  },
  {
    method: 'POST',
    path: '/categories',
    handler: Categories.create
  },
  {
    method: 'PUT',
    path: '/categories/{id}',
    handler: Categories.update
  },
  {
    method: 'DELETE',
    path: '/categories/{id}',
    handler: Categories.remove
  },
  {
    method: 'GET',
    path: '/categories/populate',
    handler: Categories.populate
  }
];