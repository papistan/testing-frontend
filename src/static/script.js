const AllExamsTable = document.getElementById("all-exams-table");
const SingleExamTable = document.getElementById("single-exam-table");
const ExamNumber = document.getElementById("exam-number");

const ExamDetails = e => {
  let id = e.target.parentElement.id;
  AllExamsTable.style.display = "none";
  SingleExamTable.style.display = "flex";
  AppendStudents(id);
};

AllExamsTable.addEventListener("click", ExamDetails);

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
      exams.exams.forEach((exam, i) => {
        ExamRowCreator(exam, i + 1);
      });
    })
    .catch(error => {
      console.log(error);
    });
};

AppendExams();

// Exam Student Logic

const StudentRowCreator = (student, counter, studentRanking) => {
  let row = SingleExamTable.insertRow(-1);
  row.setAttribute("id", `${student.id}`);
  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);
  let cell3 = row.insertCell(2);
  cell1.innerHTML = `Student ${counter}`;
  let studentGrade = Math.round(student.score * 100);
  cell2.innerHTML = `${studentGrade}%`;
  cell3.innerHTML = `${studentRanking[student.studentId]}`;
};

const rankStudents = students => {
  let studentRanking = {};
  let rankedStudents = [...students].sort((a, b) => a.score - b.score);
  rankedStudents.forEach((student, i) => {
    studentRanking[student.studentId] = i + 1;
  });

  return studentRanking;
};

const AppendStudents = examId => {
  FetchData(`/api/v1/exams/${examId}`)
    .then(students => {
      let studentRanking = rankStudents(students.results);
      
      students.results.forEach((student, i) => {
        StudentRowCreator(student, i + 1, studentRanking);
      });

    })
    .catch(error => {
      console.log(error);
    });
};