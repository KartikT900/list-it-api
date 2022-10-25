import './server';
import getAllUsers from './service/sample.service';

async function main() {
  try {
    await getAllUsers();
  } catch (e) {
    // error handling
  }
}

void main();
