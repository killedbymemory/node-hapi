var Promise = require('bluebird');
var Waterline = require('waterline');
var waterline = new Waterline();

var config = {
  adapters: {
    memory: require('sails-memory')
  },
  connections: {
    default: {
      adapter: 'memory'
    }
  }
};

// Load models to waterline instance
var models = ['product', 'category'].forEach(function (model) {
  require('./models/' + model)(waterline);
});

module.exports.connect = function () {
  return new Promise(function (resolve, reject) {
    // Establish connection to data source
    waterline.initialize(config, function (err, database) {
      if (err) {
        return console.error(err);
        return reject(err);
      }

      return resolve(database);
    });
  });
};

module.exports.test = function () {
  var connection = module.exports.connect();
  connection.then(function(database) {
    var Product = database.collections.product;
    var Category = database.collections.category;

    function createVideoGameCategory() {
      return Category.create({name: 'Video Game'});
    }

    function createConsoleCategory(videoGameCategory) {
      return Category.create({name: 'Console', parent: videoGameCategory.id});
    }

    function createPlayStationFour(consoleCategory) {
      return Product.create({name: 'PlayStation 4', category: consoleCategory.id});
    }

    function getPlayStationFourCategory(playStationFour) {
      return Category.findOne({id: playStationFour.category});
    }

    function getConsoleParentCategory(consoleCategory) {
      return Category.findOne({id: consoleCategory.parent});
    }

    createVideoGameCategory()
      .then(createConsoleCategory)
      .then(createPlayStationFour)
      .then(function (playstationFour) {
        console.log("Play Station 4 id is equal to 1:", playstationFour.id === 1);
        return getPlayStationFourCategory(playstationFour);
      })
      .then(function (consoleCategory) {
        console.log("Console category id is equal to 2:", consoleCategory.id === 2);
        console.log("Console category parent id is equal to 1:", consoleCategory.parent === 1);
        return getConsoleParentCategory(consoleCategory);
      })
      .then(function (videoGameCategory) {
        console.log("Video Game category id is equal to 1:", videoGameCategory.id === 1);
        console.log("Video Game category parent id is equal to undefined:", videoGameCategory.parent === undefined);
      })
      .catch(console.error.bind(console))
      .finally(process.exit.bind(process));
  });
};

if (require.main === module) {
  module.exports.test();
}