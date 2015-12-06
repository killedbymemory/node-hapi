var Promise = require('bluebird');

module.exports.find = function (request, reply) {
  var Category = this.collections.category;
  return reply(Category.find());
};

module.exports.findOne = function (request, reply) {
  var Category = this.collections.category;

  Category
    .findOne({
      id: request.params.id
    })
    .then(function (category) {
      if (!category) {
        return reply.notFound();
      }

      return reply(category);
    });
};

module.exports.create = function (request, reply) {
  var Category = this.collections.category;

  return reply(Category.create({
    name: request.payload.name,
    parent: (request.payload.parent || undefined)
  }));
};

module.exports.update = function (request, reply) {
  var Category = this.collections.category;

  var attributes = {
    name: '',
    parent: null
  };

  for (var key in attributes) {
    if (request.payload.hasOwnProperty(key)) {
      attributes[key] = request.payload[key];
    } else {
      delete attributes[key];
    }
  }

  var getDetail = function () {
    return Category.findOne({id: request.params.id});
  }

  var updateCategory = function (category) {
    return Category
      .update(
        {
          id: category.id,
          name: category.name,
          parent: category.parent
        },
        attributes
      );
  }

  var maxAttempt = 5;
  (function updateAttempt(numAttempt) {
    getDetail()
      .then(updateCategory)
      .then(function (category) {
        --numAttempt;
        // console.log('num of attempt left:', numAttempt);

        if (category instanceof Array && category.length === 0) {
          if (numAttempt > 0) {
            return process.nextTick(updateAttempt.bind(null, numAttempt))
          }

          return reply.notFound();
        }

        return reply(category);
      })
      .catch(console.error.bind(console));
  })(maxAttempt);
};

module.exports.remove = function (request, reply) {

};

module.exports.populate = function (request, reply) {
  var Category = this.collections.category;

  function createVideoGameCategory() {
    return Category.create({name: 'Video Game'});
  }

  function createConsoleCategory(videoGameCategory) {
    return Category.create({name: 'Console', parent: videoGameCategory.id});
  }

  function createPCCategory(videoGameCategory) {
    return Category.create({name: 'PC', parent: videoGameCategory.id});
  }

  function createHandheldCategory(videoGameCategory) {
    return Category.create({name: 'Console', parent: videoGameCategory.id});
  }

  createVideoGameCategory()
    .then(function (videoGameCategory) {
      var createSubCategories = [
        createConsoleCategory(videoGameCategory),
        createPCCategory(videoGameCategory),
        createHandheldCategory(videoGameCategory)
      ];

      return Promise.all(createSubCategories);
    })
    .then(function () {
      return reply({populated: true})
    })
    .catch(function (err) {
      console.error(err);
    })
}