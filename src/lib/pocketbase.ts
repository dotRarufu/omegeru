import PocketBase from 'pocketbase';
const pb = new PocketBase(import.meta.env.VITE_INSTANCE_ADDRESS);
// todo: turned off, because of duplicate renders in dev mode
pb.autoCancellation(false);

export default pb;
