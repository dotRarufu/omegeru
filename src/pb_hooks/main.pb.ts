// <reference path="../pb_data/types.d.ts" />

let counter = 0;

routerAdd('GET', '/hello/:name', c => {
  const name = c.pathParam('name');
  console.log(`hello: ${name}`);
  counter += 1;
  return c.json(200, { message: counter.toString() + ' | Hello ' + name });
});

onRealtimeDisconnectRequest(e => {
  console.log('====onRealTimeDisconnectRequest====');
  console.log('e.client keys');
  // console.log(`${Object.keys(e)}`);
  console.log('----------------');
  console.log('e.client.id():');
  console.log(e.client.id());
  console.log('----------------');
});

onRealtimeConnectRequest(e => {
  console.log('====CONNECT====');
  const a = e.httpContext.request()?.context();
  // console.log('basic auth:', a);
  const authRecord = e.client.get('authRecord') as string;
  const admin = e.client.get('admin') as string;
  const requestedInfo = $apis.requestInfo(e.httpContext)?.authRecord || {
    undefined: 'undefined',
  };

  console.log(`authRecord: ${authRecord}`);
  console.log(`admin: ${admin}`);
  console.log(`requestedInfo:`);
  console.log(Object.keys(requestedInfo));

  console.log(e.client.id());
});
