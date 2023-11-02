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
  console.log(`${clientId} disconnected`);
  const userRecord = $app
    .dao()
    .findFirstRecordByData('user', 'client_id', clientId);

  if (!userRecord) return;

  const userSession = userRecord.getString('session_id');
  const sessionRecord = $app.dao().findRecordById('session', userSession);

  // Remove user's session
  userRecord.set('session_id', '');
  $app.dao().saveRecord(userRecord);

  if (!sessionRecord)
    console.log(
      `User${userRecord.id} was connected to a non existent session (${userSession})`
    );
  // Remove user from session
  if (sessionRecord.getString('user1') === userRecord.id)
    sessionRecord.set('user1', '');
  if (sessionRecord.getString('user2') === userRecord.id)
    sessionRecord.set('user2', '');

  $app.dao().saveRecord(sessionRecord);
});

onModelAfterCreate(e => {
  console.log('1 new queued user created: ' + e.model.id);
  const queuedUsers = $app.dao()?.findRecordsByExpr('queued_user');

  const filtered = queuedUsers.filter(v => v !== undefined);

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
  user1Record.set('session_seat', 1);
  $app.dao().saveRecord(user1Record);

  // Set user 2's session
  const user2Record = $app.dao().findRecordById('user', user2);
  user2Record.set('session_id', session.id);
  user2Record.set('session_seat', 2);
  $app.dao().saveRecord(user2Record);

  // Delete user1's queue record
  const user1QueueRecord = $app.dao().findRecordById('queued_user', queued1.id);
  $app.dao().deleteRecord(user1QueueRecord);

  // Delete user2's queue record
  const user2QueueRecord = $app.dao().findRecordById('queued_user', queued2.id);
  $app.dao().deleteRecord(user2QueueRecord);
}, 'queued_user');
