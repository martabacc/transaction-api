import Hapi from 'hapi';
import Path from 'path';
import App from '../src/App';

const port = process.env.PORT;
const hapiServer = new Hapi.Server({
  port,
  routes: {
    files: {
      relativeTo: Path.join(`${__dirname}/../src/`, 'public'),
    },
  },
});
const app = new App(hapiServer);
app.start();

