const { Board, Led } = require('johnny-five');
const { delay } = require('bluebird');

const board = new Board({ port: 'COM3' });

function init() {
  return new Promise((resolve) => {
    board.on('ready', () => {
      resolve();
    });
  });
}

async function blink(led) {
  for (let i = 0; i < 5; i++) {
    led.on();
    await delay(300);
    led.off();
    await delay(300);
  }
}

async function runSemaphore() {
  const sem1 = {
    red: new Led(2),
    yellow: new Led(3),
    green: new Led(4)
  };

  const sem2 = {
    red: new Led(5),
    yellow: new Led(6),
    green: new Led(7)
  };

  sem1.green.on();
  sem2.red.on();

  await delay(3000);

  await blink(sem1.green);
  sem1.yellow.on();
  await blink(sem2.red);

  sem1.yellow.off();
  sem1.red.on();

  sem2.red.off();
  sem2.green.on();

  await delay(3000);

  await blink(sem2.green);
  sem2.yellow.on();
  await blink(sem1.red);

  sem2.yellow.off();
  sem2.red.on();

  sem1.red.off();
  sem1.green.on();

  setTimeout(runSemaphore);
}

async function main() {
  console.log('Initializing...');
  await init();

  runSemaphore();
}

main();