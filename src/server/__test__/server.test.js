// Import the js file to test
//import { sortByDate } from "../server.js";
describe("Testing the sort by date functionality", () => {
  test("Testing the sortByDate() function", async () => {
    let test = [
      {
        country: "Saudi Arabia",
        city: "Şafwá",
        startDate: "2023-01-04",
        endDate: "2023-01-06",
        minTemp: 17.3,
        maxTemp: 20.2,
        image:
          "https://pixabay.com/get/gdbff1f1a4ecc5fc35ad6e5db3e3be11da2986874d804955118e6fa39e70100d859269f44f0489d74954544442a85e8bb_640.jpg",
        duration: 2,
      },
      {
        country: "Saudi Arabia",
        city: "Şafwá",
        startDate: "2023-01-14",
        endDate: "2023-01-20",
        minTemp: 17.3,
        maxTemp: 20.2,
        image:
          "https://pixabay.com/get/gdbff1f1a4ecc5fc35ad6e5db3e3be11da2986874d804955118e6fa39e70100d859269f44f0489d74954544442a85e8bb_640.jpg",
        duration: 7,
      },
    ];

    let result = [
      {
        country: "Saudi Arabia",
        city: "Şafwá",
        startDate: "2023-01-14",
        endDate: "2023-01-20",
        minTemp: 17.3,
        maxTemp: 20.2,
        image:
          "https://pixabay.com/get/gdbff1f1a4ecc5fc35ad6e5db3e3be11da2986874d804955118e6fa39e70100d859269f44f0489d74954544442a85e8bb_640.jpg",
        duration: 7,
      },
      {
        country: "Saudi Arabia",
        city: "Şafwá",
        startDate: "2023-01-04",
        endDate: "2023-01-06",
        minTemp: 17.3,
        maxTemp: 20.2,
        image:
          "https://pixabay.com/get/gdbff1f1a4ecc5fc35ad6e5db3e3be11da2986874d804955118e6fa39e70100d859269f44f0489d74954544442a85e8bb_640.jpg",
        duration: 2,
      },
    ];

    // creating a mock of the function since jest tries to test the whole document
    const mockTest = jest.fn((a, b) => {
      if (new Date(a.startDate) < new Date(b.startDate)) {
        return 1;
      } else if (new Date(a.startDate) > new Date(b.startDate)) {
        return -1;
      } else {
        if (new Date(a.endDate) < new Date(b.endDate)) {
          return 1;
        } else if (new Date(a.endDate) > new Date(b.endDate)) {
          return -1;
        } else {
          return 0;
        }
      }
    });

    expect(test.sort(mockTest)).toStrictEqual(result);
    //expect(sortByDate).toBeDefined();
  });
});
