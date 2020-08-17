const { accounts, contract } = require('@openzeppelin/test-environment');
const assert = require('assert');
const web3 = require('web3');

const BN = web3.utils.BN;

const Cars = contract.fromArtifact('Cars');

describe('Cars - initial state', () => {
  const [owner] = accounts;

  let instance;

  before(async () => {
    instance = await Cars.new({ from: owner });
  });

  it('Initialised with zero cars', async () => {
    const initialNumCars =
      await instance.numCars.call();

    // TODO perform assertions
  });
});

describe('Cars - state transitions', () => {
  const [owner] = accounts;

  let instance;

  before(async () => {
    instance = await Cars.new({ from: owner });
  });

  it('Adds a new car', async () => {
    // preview the return value without modifying the state
    const returnValue =
      await instance.addCar.call(
        '0xff00ff', // colour: purple
        new BN(4), // doors: 4
        new BN(0), // distance: 0
        new BN(0), // lat: 0
        new BN(0), // lon: 0
        {
          from: accounts[1],
          value: web3.utils.toWei('0.11', 'ether'),
        },
      );
    // TODO perform the assertions

    // perform the state transition
    const tx =
      await instance.addCar(
        '0xff00ff', // colour: purple
        new BN(4), // doors: 4
        new BN(0), // distance: 0
        new BN(0), // lat: 0
        new BN(0), // lon: 0
        {
          from: accounts[1],
          value: web3.utils.toWei('0.11', 'ether'),
        },
      );

    // retrieve the updated state
    const numCars =
      await instance.numCars.call();
    const car1 =
      await instance.cars.call(new BN(1));

    // TODO perform the assertions
  });

});

describe('Cars - events', () => {
  const [owner] = accounts;

  let instance;

  before(async () => {
    instance = await Cars.new({ from: owner });

    // set up contract with relevant initial state
    await instance.addCar(
      '0xff00ff', // colour: purple
      new BN(4), // doors: 4
      new BN(0), // distance: 0
      new BN(0), // lat: 0
      new BN(0), // lon: 0
      {
        from: accounts[1],
        value: web3.utils.toWei('0.11', 'ether'),
      },
    );

    await instance.addCar(
      '0xffff00', // colour: yellow
      new BN(2), // doors: 2
      new BN(0), // distance: 0
      new BN(0), // lat: 0
      new BN(0), // lon: 0
      {
        from: accounts[2],
        value: web3.utils.toWei('0.11', 'ether'),
      },
    );

    // just a sanity check, we do not really need to do assertions
    // within the set up, as this should be for "known working state"
    // only
    const numCars =
      await instance.numCars.call();
    assert.equal(numCars.toString(), '2');
  });

  it('Honks a car at another car', async () => {
    // perform the state transition
    const tx =
      await instance.honkCar(
        2,
        1,
        {
          // account #2 owns car #2
          from: accounts[2],
        },
      );

      // TODO perform assertions
  });

  it('Honking a car that you do not own is not allowed', async () => {
    // perform the state transition
    let tx;
    let err;
    try {
      tx =
        await instance.honkCar(
          2,
          1,
          {
            // account #3 does not own any cars, only account #1 and #2 do
            from: accounts[3],
          },
        );
    } catch (ex) {
      err = ex;
    }

    // TODO perform assertions
  });

});
