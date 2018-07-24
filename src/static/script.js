const AllExamsTable = document.getElementById("all-exams-table");
const AllExamsTableContainer = document.getElementById(
  "all-exams-table-container"
);
const SingleExamTable = document.getElementById("single-exam-table");
const SingleExamTableContainer = document.getElementById(
  "single-exam-table-container"
);
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
const ExamRowsCreator = allExams => {
  allExams.forEach((exam, i) => {
    let row = AllExamsTable.insertRow(-1);
    row.setAttribute("id", `${exam.id}`);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    cell1.innerHTML = `Exam ${i + 1}`;
    let examGrade = Math.round(exam.average * 100);
    cell2.innerHTML = `${examGrade}%`;
    cell3.innerHTML = `${exam.studentCount}`;
  });
};

const AppendExams = () => {
  FetchData("/api/v1/exams")
    .then(exams => {
      let allExams = exams.exams;
      ExamRowsCreator(allExams);
    })
    .catch(error => {
      console.log(error);
    });
};

AppendExams();

const ExamDetails = e => {
  let id = e.target.parentElement.id;
  let examNum = e.target.parentElement.firstChild.innerHTML;
  AllExamsTableContainer.style.display = "none";
  SingleExamTableContainer.style.display = "flex";
  ExamNumber.innerHTML = `${examNum}`;
  AppendStudents(id);
};

AllExamsTable.addEventListener("click", ExamDetails);

// Exam Student Logic

const StudentRowsCreator = (allStudents, studentRankingReference) => {
  allStudents.forEach((student, i) => {
    let rank = studentRankingReference[student.studentId];
    let row = SingleExamTable.insertRow(-1);
    row.setAttribute("id", `${student.id}`);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    cell1.innerHTML = `Student ${i + 1}`;
    let studentGrade = Math.round(student.score * 100);
    cell2.innerHTML = `${studentGrade}%`;
    cell3.innerHTML = `${rank}`;
  });
};

const rankStudents = students => {
  let studentRankingReference = {};
  let studentsSortedByScore = [...students].sort((a, b) => b.score - a.score);
  studentsSortedByScore.forEach((student, i) => {
    studentRankingReference[student.studentId] = i + 1;
  });

  return studentRankingReference;
};

const AppendStudents = examId => {
  FetchData(`/api/v1/exams/${examId}`)
    .then(students => {
      let allStudents = students.results;
      let studentRankingReference = rankStudents(allStudents);
      StudentRowsCreator(allStudents, studentRankingReference);
    })
    .catch(error => {
      console.log(error);
    });
};
