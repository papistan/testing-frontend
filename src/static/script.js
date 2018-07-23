const AllExamsTable = document.getElementById("all-exams-table");
const SingleExamTable = document.getElementById("single-exam-table");
const ExamNumber = document.getElementById("exam-number");

const FetchData = async url => {
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (err) {
    console.log("fetch failed", err);
  }
};

// All Exam Logic
const ExamRowCreator = (exam, counter) => {
  let row = AllExamsTable.insertRow(-1);
  row.setAttribute("id", `${exam.id}`);
  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);
  let cell3 = row.insertCell(2);
  cell1.innerHTML = `Exam ${counter}`;
  let examGrade = Math.round(exam.average * 100);
  cell2.innerHTML = `${examGrade}%`;
  cell3.innerHTML = `${exam.studentCount}`;
};

const AppendExams = () => {
  FetchData("/api/v1/exams")
    .then(exams => {
      let counter = 1;
      exams.exams.forEach(exam => {
        ExamRowCreator(exam, counter);
        counter++;
      });
    })
    .catch(error => {
      console.log(error);
    });
};

AppendExams();
