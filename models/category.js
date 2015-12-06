var Waterline = require('waterline');

var Category = Waterline.Collection.extend({
  identity: 'category',
  connection: 'default',
  attributes: {
    name: 'string',
    parent: {
      model: 'category'
    }
  }
});

module.exports = function (waterline) {
  waterline.loadCollection(Category);
  return Category;
}