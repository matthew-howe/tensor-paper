const { db } = require("./server/db");
const { green, red } = require("chalk");

const Campuses = require("./server/db/models/campuses");
const Students = require("./server/db/models/students");

//note SINGULAR array, not like the import
const campus = [
  {
    name: "TestCampus1",
    imageUrl: "TestImgUrl1",
    address: "9999 TestAddress1",
    description: "LongTestText1"
  },
  {
    name: "TestCampus2",
    imageUrl: "TestImgUrl2",
    address: "9999 TestAddress2",
    description: "LongTestText2"
  },
  {
    name: "TestCampus3",
    imageUrl: "TestImgUrl3",
    address: "9999 TestAddress3",
    description: "LongTestText3"
  },
  {
    name: "TestCampus4",
    imageUrl: "TestImgUrl4",
    address: "9999 TestAddress4",
    description: "LongTestText4"
  }
];

const student = [
  {
    firstName: "FirstName1",
    lastName: "LastName1",
    email: "test1@gmail.com",
    imageUrl: "studImageUrl1.jpg",
    gpa: 3.1,
    campusId: 1
  },
  {
    firstName: "FirstName2",
    lastName: "LastName2",
    email: "test2@gmail.com",
    imageUrl: "studImageUrl2.jpg",
    gpa: 3.2,
    campusId: 1
  },
  {
    firstName: "FirstName3",
    lastName: "LastName3",
    email: "test3@gmail.com",
    imageUrl: "studImageUrl3.jpg",
    gpa: 3.3,
    campusId: 1
  },
  {
    firstName: "FirstName4",
    lastName: "LastName4",
    email: "test4@gmail.com",
    imageUrl: "studImageUrl4.jpg",
    gpa: 3.4,
    campusId: 1
  }
];

const seed = async () => {
  try {
    await db.sync({ force: true });

    await Promise.all(
      campus.map(campus => {
        return Campuses.create(campus);
      })
    );
    await Promise.all(
      student.map(student => {
        return Students.create(student);
      })
    );
    console.log(green("Seeding success!"));
    db.close();
  } catch (err) {
    console.error(red("Oh dear!!!!! Something went awry :/!"));
    console.error(err);
    db.close();
  }
};

seed();
