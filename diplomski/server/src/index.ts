import app from './app';
import { KONFIG } from './config';


const PORT = process.env.PORT ?? 3001;
app.listen(KONFIG.port, () => {
  console.log(`✅ Server sluša na http://localhost:${KONFIG.port}`);
});
