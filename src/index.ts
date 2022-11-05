import './server';
import getAllUsersCount from './service/sample.service';

async function main() {
  try {
    const users = await getAllUsersCount();
    // eslint-disable-next-line no-console
    console.info(`db users count:${users}`);
  } catch (e) {
    // error handling
  }
}

void main();
