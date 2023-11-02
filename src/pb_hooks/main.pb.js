// todo: setup transpile config

let counter = 0;

routerAdd('GET', '/hello/:name', c => {
  const name = c.pathParam('name');
  console.log(`hello: ${name}`);
  counter += 1;
  return c.json(200, { message: counter.toString() + ' | Hello ' + name });
});

// onRealtimeDisconnectRequest(e => {
//   console.log('====onRealTimeDisconnectRequest====');
//   console.log('e.client keys');
//   // console.log(`${Object.keys(e)}`);
//   console.log('----------------');
//   console.log('e.client.id():');
//   console.log(e.client.id());
//   console.log('----------------');
// });

// onRealtimeConnectRequest(e => {
//   console.log('====CONNECT====');
//   const a = e.httpContext.request()?.context();
//   // console.log('basic auth:', a);
//   const authRecord = e.client.get('authRecord') ;
//   const admin = e.client.get('admin') ;
//   const requestedInfo = $apis.requestInfo(e.httpContext)?.authRecord || {
//     undefined: 'undefined',
//   };

//   console.log(`authRecord: ${authRecord}`);
//   console.log(`admin: ${admin}`);
//   console.log(`requestedInfo:`);
//   console.log(Object.keys(requestedInfo));

//   console.log(e.client.id());
// });

onModelAfterCreate(e => {
  console.log('1 new queued user created: ' + e.model.id);
  const queuedUsers = $app.dao()?.findRecordsByExpr('queued_user');
  // console.log('raw length:' + queuedUsers.length.toString());
  const filtered = queuedUsers.filter(v => v !== undefined);
  // console.log('filtered length:' + filtered.length.toString());
  if (filtered.length < 2) return;

  const queued1 = queuedUsers[0];
  const queued2 = queuedUsers[1];
  const user1 = queued1.getString('user');
  const user2 = queued2.getString('user');
  console.log('match these users:');
  console.log(queuedUsers[0].getString('user'));
  console.log(queuedUsers[1].getString('user'));

  // Create session
  const collection = $app.dao().findCollectionByNameOrId('session');
  const session = new Record(collection, {});
  $app.dao().saveRecord(session);
  console.log('new session: ' + session.id);

  // Set user 1's session
  const user1Record = $app.dao().findRecordById('user', user1);
  user1Record.set('session_id', session.id);
  $app.dao().saveRecord(user1Record);

  // Set user 2's session
  const user2Record = $app.dao().findRecordById('user', user2);
  user2Record.set('session_id', session.id);
  $app.dao().saveRecord(user2Record);

  // Delete user1's queue record
  const user1QueueRecord = $app.dao().findRecordById('queued_user', queued1.id);
  $app.dao().deleteRecord(user1QueueRecord);

  // Delete user2's queue record
  const user2QueueRecord = $app.dao().findRecordById('queued_user', queued2.id);
  $app.dao().deleteRecord(user2QueueRecord);
}, 'queued_user');
