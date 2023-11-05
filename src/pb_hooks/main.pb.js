// todo: setup transpile config

let counter = 0;

routerAdd('GET', '/hello/:name', c => {
  const name = c.pathParam('name');
  console.log(`hello: ${name}`);
  counter += 1;
  return c.json(200, { message: counter.toString() + ' | Hello ' + name });
});

onRealtimeDisconnectRequest(e => {
  const clientId = e.client.id();
  // console.log(`${clientId} disconnected`);
  const userRecord = $app
    .dao()
    .findFirstRecordByData('user', 'client_id', clientId);

  if (!userRecord) return;
  console.log('====onRealTimeDisconnectRequest====');
  console.log('Removed session id for:', userRecord.id);
  const userSession = userRecord.getString('session_id');
  const sessionRecord = $app.dao().findRecordById('session', userSession);
  const seat = userRecord.getInt('session_seat');
  // Remove user's session
  userRecord.set('session_id', '');
  $app.dao().saveRecord(userRecord);

  if (!sessionRecord)
    console.log(
      `User${userRecord.id} was connected to a non existent session (${userSession})`
    );
  // Remove user from session
  if (sessionRecord.getString('user1') === userRecord.id) {
    console.log('removed from seat 1');
    sessionRecord.set('user1', '');
  }
  if (sessionRecord.getString('user2') === userRecord.id) {
    console.log('removed from seat 2');
    sessionRecord.set('user2', '');
  }

  $app.dao().saveRecord(sessionRecord);
});

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
  console.log(user1);
  console.log(user2);

  // Create session
  const collection = $app.dao().findCollectionByNameOrId('session');
  const session = new Record(collection, {});
  $app.dao().saveRecord(session);
  console.log('new session: ' + session.id);

  // Update user 1's session
  const user1Record = $app.dao().findRecordById('user', user1);
  const formUser1 = new RecordUpsertForm($app, user1Record);
  formUser1.loadData({
    session_id: session.id,
    session_seat: 1,
  });
  formUser1.submit();

  // Update user 2's session
  const user2Record = $app.dao().findRecordById('user', user2);
  const formUser2 = new RecordUpsertForm($app, user2Record);
  formUser2.loadData({
    session_id: session.id,
    session_seat: 2,
  });
  formUser2.submit();

  // Delete user1's queue record
  const user1QueueRecord = $app.dao().findRecordById('queued_user', queued1.id);
  $app.dao().deleteRecord(user1QueueRecord);

  // Delete user2's queue record
  const user2QueueRecord = $app.dao().findRecordById('queued_user', queued2.id);
  $app.dao().deleteRecord(user2QueueRecord);
}, 'queued_user');
