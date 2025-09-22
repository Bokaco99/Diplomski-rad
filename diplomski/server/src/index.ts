import app from './app';
import { KONFIG } from './config';

app.listen(KONFIG.port, () => {
  console.log(`✅ Server sluša na http://localhost:${KONFIG.port}`);
});
