// todo: setup transpile config

let counter = 0;

routerAdd('GET', '/hello/:name', c => {
  const name = c.pathParam('name');
  console.log(`hello: ${name}`);
  counter += 1;
  return c.json(200, { message: counter.toString() + ' | Hello ' + name });
});

onRealtimeDisconnectRequest(e => {
  console.log('====onRealTimeDisconnectRequest====');
  const clientId = e.client.id();
  console.log(`${clientId} disconnected`)
  const record = $app
    .dao()
    .findFirstRecordByData('user', 'client_id', clientId);

  if (!record) return;

  // Mark user as disconnected
  record.set('is_connected', false);
  $app.dao().saveRecord(record);

  // Get session record
  const userSession = record.getString('session_id');
  const sessionRecord = $app.dao().findRecordById('session', userSession);

  if (!sessionRecord)
    console.log(
      `User${record.id} was connected to a non existent session (${userSession})`
    );

  // Get session participants
  const participantRecords = $app
    .dao()
    .findRecordsByFilter(
      'user', // collection
      `session_id = '${userSession}'`, // filter
      '', // sort
      0, // limit
      0 // limit
    )
    .filter(v => v !== undefined);

  const bothDisconnected = participantRecords
    .map(p => p.getBool('is_connected'))
    .every(v => v);

  if (!bothDisconnected) return;

  // Delete session record
  $app.dao().deleteRecord(sessionRecord);

  // Remove participants' session id
  participantRecords.forEach(p => p.set('session_id', ''));
});

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
