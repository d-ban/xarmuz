/*
 * Distinct Search - can only be 1 distinct at a time
 * - allows you to URI query like: books?$distinct=author
 * ============================================================
 */
exports.searchDistinct = function () {
  return function (hook) {
    let query = hook.params.query;

    // Must be a before hook
    if (hook.type !== 'before') {
      throw new Error('The \'searchDistinct\' hook should only be used as a \'before\' hook (hooks.searchDistinct).');
    }

    // Throw error when no field is provided - eg. just users?$distinct
    if (query.$distinct === '') {
     throw new Error('Missing $distinct: Which field should be distinct? (hooks.searchDistinct)');
    }

    let distinctValue = query.$distinct || null;
    if (distinctValue == null) return hook;

    // Remove $distinct param from query (preventing errors)
    delete query.$distinct;

    var args = [
      { $match: query || {} },
      { $group: {
        _id: "$" + distinctValue,
        total: { $sum: 1 }
      }}
    ];

    return this.Model.aggregate(args)
      .then(data => {
        hook.result = {
          total: data.length || 0,
          data,
        };

        return hook;
      });
  }
}
