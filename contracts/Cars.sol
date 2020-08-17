pragma solidity ^0.5.0;

contract Cars {

    enum CarStatus { driving, parked }

    event CarHonk (uint256 indexed fromCar, uint256 indexed atCar);

    struct Car {
        bytes3 colour;
        uint8 doors;
        uint256 distance;
        uint16 lat;
        uint16 lon;
        CarStatus status;
        address owner;
    }

    uint256 public numCars = 0;
    mapping(uint256 => Car) public cars;

    constructor() public {}

    function addCar(
        bytes3 colour,
        uint8 doors,
        uint256 distance,
        uint16 lat,
        uint16 lon
    ) public payable returns(uint256 carId) {
        require(msg.value > 0.1 ether,
          "You need at least 0.1 ETH to get a car");
        carId = ++numCars;
        Car memory newCar = Car(
            colour,
            doors,
            distance,
            lat,
            lon,
            CarStatus.parked,
            msg.sender
        );
        cars[carId] = newCar;
    }

    modifier onlyCarOwner(uint256 carId) {
        require(cars[carId].owner == msg.sender,
            "you need to own this car");
        _;
    }

    modifier onlyCarStatus(uint256 carId, CarStatus expectedStatus) {
        require(cars[carId].status == expectedStatus,
            "car is not in the required status");
        _;
    }

    function driveCar(uint256 carId)
        public
        onlyCarOwner(carId)
        onlyCarStatus(carId, CarStatus.parked)
    {
        cars[carId].status = CarStatus.driving;
    }

    function parkCar(uint256 carId, uint16 lat, uint16 lon)
        public
        onlyCarOwner(carId)
        onlyCarStatus(carId, CarStatus.driving)
    {
        cars[carId].status = CarStatus.parked;
        cars[carId].lat = lat;
        cars[carId].lon = lon;
    }

    function honkCar(uint256 carId, uint256 otherCarId)
        public
        onlyCarOwner(carId)
    {
        require(cars[otherCarId].owner != address(0x00),
          "other car must exist");
        // uint256 timeOfDay = (getTime() % 86400);
        // require(timeOfDay >= 21600,
        //     "cannot honk between midnight and 6am"
        // );
        emit CarHonk(carId, otherCarId);
    }

    function getTime() internal view returns (uint256) {
        // current block timestamp as seconds since unix epoch
        // ref: https://solidity.readthedocs.io/en/v0.5.7/units-and-global-variables.html#block-and-transaction-properties
        return block.timestamp;
    }
}
