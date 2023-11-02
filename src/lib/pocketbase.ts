import PocketBase from 'pocketbase';
const pb = new PocketBase('https://omegeru.pockethost.io');
// todo: turned off, becausae of duplicate renders in dev mode
pb.autoCancellation(false);

export default pb;
