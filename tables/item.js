
var table = module.exports = require('azure-mobile-apps').table();

// READ - only return records belonging to the authenticated user
table.read(function (context) {
    context.query.where({ userId: context.user.id }).where({ found: false });
    return context.execute();
});

// CREATE - add or overwrite the userId based on the authenticated user
table.insert(function (context) {
    context.item.userId = context.user.id;
    return context.execute();
});

// UPDATE - only allow updating of record belong to the authenticated user
table.update(function (context) {
    context.query.where({ userId: context.user.id });
    return context.execute();
});
/*
// DELETE - only allow deletion of records belong to the authenticated uer
table.delete(function (context) {
    context.query.where({ userId: context.user.id });
    return context.execute();
});*/

// An example to disable deletions - the same operation can be used on
// any table operation (read, insert, update, delete)
table.delete.access = 'disabled';
module.exports = table;
