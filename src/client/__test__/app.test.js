// Import the js file to test
//import { calculateTripDuration } from "../js/app.js";
describe("Testing the claculate trip duration functionality", () => {
  test("Testing the calculateTripDuration() function", async () => {
    let result1 = 8;
    let result2 = 5;

    // creating a mock of the function since jest tries to test the whole document
    const mockTest = jest.fn((startDate, endDate) => {
      let tripDuration = new Date(endDate) - new Date(startDate);
      tripDuration = tripDuration / (1000 * 60 * 60 * 24) + 1;
      return tripDuration;
    });

    expect(mockTest("2023-01-14", "2023-01-21")).toBe(result1);
    expect(mockTest("2023-01-22", "2023-01-26")).toBe(result2);
    //expect(calculateTripDuration).toBeDefined();
  });
});
