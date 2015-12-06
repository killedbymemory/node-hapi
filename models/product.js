var Waterline = require('waterline');

var Product = Waterline.Collection.extend({
  identity: 'product',
  connection: 'default',
  attributes: {
    name: 'string',
    category: {
      model: 'category'
    }
  }
});

module.exports = function (waterline) {
  waterline.loadCollection(Product);
  return Product;
}