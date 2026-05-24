const homeScreen = document.querySelector("#home");
const portal = document.querySelector("#portal");
const enterPortalButton = document.querySelector("#enterPortal");
const dummySubmitButton = document.querySelector("#dummySubmit");
const authTitle = document.querySelector("#authTitle");
const authHint = document.querySelector("#authHint");
const authActions = document.querySelectorAll("[data-auth-action]");

const electiveReviews = [
  {
    course: "Econometrics-1",
    courseId: "HS5708",
    professor: "Sabuj Kumar Mandal",
    review: "Professor is very unpredictable and affects grades pretty often.",
  },
  {
    course: "Fundamentals of Operations Research",
    courseId: "MS3510",
    professor: "Srinivasan G",
    review:
      "Overall it is a usual SAB course, but you have to put more effort into practicing theoretical problems to get a good score in exams. Strict attendance.",
  },
  {
    course: "Literature and Values",
    courseId: "HS4210",
    professor: "Swarnlata",
    review:
      "Interesting for those who enjoy philosophy, with lots of discussions and presentations requiring strong writing skills. Grading is tough; answers must be 150-200 words with clear grammar.",
  },
  {
    course: "Principles of Economics",
    courseId: "",
    professor: "Subash Kumar Sahu",
    review:
      "Quizzes are MCQs; endsem is descriptive with short answers and fill-in-the-blanks. Grading seems manageable, and good grades are possible.",
  },
  {
    course: "War and Peace in West Asia",
    courseId: "",
    professor: "Tabraz",
    review: "Attend class and take notes; getting S, A, or B is manageable.",
  },
  {
    course: "Climate Economics",
    courseId: "HS5760",
    professor: "Santosh Kumar Sahu",
    review:
      "Endsem is 60 marks, attempt any 6 out of 10 questions. Easy if you study slides. Overall an easy SAB course; submit assignments on time for a safe B grade.",
  },
  {
    course: "Technology and Sustainable Development",
    courseId: "HS5060",
    professor: "Krishna Malakar",
    review: "Good course. Midsem, endsem, and presentation. Easy grading.",
  },
  {
    course: "Fostering Enriching Relationships",
    courseId: "GN6109",
    professor: "",
    review: "Sometimes boring, but you can still get an S. Grading depends on the TA.",
  },
  {
    course: "Flow of Performance",
    courseId: "GN61200",
    professor: "Prasana",
    review: "You need to attend every class. S is possible; worst case A.",
  },
  {
    course: "Leadership Lessons from IKS",
    courseId: "GN5008",
    professor: "",
    review: "Very chill course. Easy S.",
  },
  {
    course: "Principles of Economics",
    courseId: "HS3002A",
    professor: "Krishna Malakar",
    review:
      "Chill course. Slides are enough to score well; quizzes are easy, endsem needs a day of prep, and grading is lenient though teaching is basic.",
  },
];

const gradeScales = {
  campus10: {
    max: 10,
    grades: [
      ["S", 10],
      ["A", 9],
      ["B", 8],
      ["C", 7],
      ["D", 6],
      ["E", 5],
      ["F", 0],
    ],
  },
  fourPoint: {
    max: 4,
    grades: [
      ["A", 4],
      ["A-", 3.7],
      ["B+", 3.3],
      ["B", 3],
      ["B-", 2.7],
      ["C+", 2.3],
      ["C", 2],
      ["C-", 1.7],
      ["D", 1],
      ["F", 0],
      ["W", 0],
      ["WP", 0],
      ["WF", 0],
    ],
  },
};

let nextCourseId = 1;

function showPortal() {
  if (!homeScreen || !portal) {
    return;
  }

  homeScreen.classList.add("is-hidden");
  homeScreen.setAttribute("aria-hidden", "true");
  portal.classList.remove("is-hidden");
  portal.removeAttribute("aria-hidden");
  portal.scrollIntoView({ block: "start" });
}

function setAuthMode(mode) {
  if (!authTitle || !authHint) {
    return;
  }

  const copy = {
    login: {
      title: "Log in to preview",
      hint: "Login is only visual for now. Continue preview opens the main page.",
    },
    signin: {
      title: "Sign in to preview",
      hint: "Sign in is a placeholder while the portal UI is being shaped.",
    },
    signup: {
      title: "Create a dummy account",
      hint: "Signup does not verify anything yet. It only keeps the homepage ready for future auth.",
    },
  };
  const activeCopy = copy[mode] || copy.signin;

  authTitle.textContent = activeCopy.title;
  authHint.textContent = activeCopy.hint;
}

authActions.forEach((button) => {
  button.addEventListener("click", () => setAuthMode(button.dataset.authAction));
});

enterPortalButton?.addEventListener("click", showPortal);
dummySubmitButton?.addEventListener("click", showPortal);

if (new URLSearchParams(window.location.search).get("view") === "portal") {
  showPortal();
}

const reviewList = document.querySelector("#reviewList");
const courseSearch = document.querySelector("#courseSearch");
const reviewCount = document.querySelector("#reviewCount");
const reviewTotal = document.querySelector("#reviewTotal");
const homeReviewTotal = document.querySelector("#homeReviewTotal");
const courseSuggestions = document.querySelector("#courseSuggestions");

function normalizeSearch(value) {
  return value.toLowerCase().trim();
}

function compactSearch(value) {
  return normalizeSearch(value).replace(/[^a-z0-9]/g, "");
}

function createMetaItem(label, value) {
  const item = document.createElement("span");
  const strong = document.createElement("strong");
  const text = document.createTextNode(value || "Not provided");

  strong.textContent = `${label}: `;
  item.append(strong, text);

  if (!value) {
    item.classList.add("is-muted");
  }

  return item;
}

function createReviewCard(review) {
  const card = document.createElement("article");
  const body = document.createElement("div");
  const title = document.createElement("h3");
  const meta = document.createElement("div");
  const text = document.createElement("p");

  card.className = "review-card";
  body.className = "review-body";
  meta.className = "review-meta";
  title.textContent = review.course;
  text.textContent = review.review;

  meta.append(
    createMetaItem("Course ID", review.courseId),
    createMetaItem("Professor", review.professor),
  );
  body.append(title, meta, text);
  card.append(body);

  return card;
}

function matchesReview(review, query) {
  const normalizedQuery = normalizeSearch(query);
  const compactQuery = compactSearch(query);

  if (!normalizedQuery) {
    return true;
  }

  const searchableValues = [review.course, review.courseId, review.professor].filter(Boolean);
  const searchableText = normalizeSearch(searchableValues.join(" "));
  const compactText = compactSearch(searchableValues.join(""));
  const terms = normalizedQuery.match(/[a-z0-9]+/g) || [];

  return (
    terms.every((term) => searchableText.includes(term)) ||
    (compactQuery.length > 0 && compactText.includes(compactQuery))
  );
}

function renderReviews() {
  const query = courseSearch.value;
  const filteredReviews = electiveReviews.filter((review) => matchesReview(review, query));

  reviewList.replaceChildren();

  if (filteredReviews.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "No matching elective found.";
    reviewList.append(emptyState);
  } else {
    reviewList.append(...filteredReviews.map(createReviewCard));
  }

  const label = filteredReviews.length === 1 ? "course" : "courses";
  reviewCount.textContent = `${filteredReviews.length} ${label} found`;
}

function populateCourseSuggestions() {
  const suggestions = electiveReviews.map((review) => {
    const option = document.createElement("option");
    option.value = review.courseId ? `${review.course} (${review.courseId})` : review.course;
    return option;
  });

  courseSuggestions.replaceChildren(...suggestions);
}

if (reviewTotal) {
  reviewTotal.textContent = String(electiveReviews.length);
}

if (homeReviewTotal) {
  homeReviewTotal.textContent = String(electiveReviews.length);
}

if (reviewList && courseSearch && reviewCount && courseSuggestions) {
  populateCourseSuggestions();
  courseSearch.addEventListener("input", renderReviews);
  renderReviews();
}

const currentCgpaInput = document.querySelector("#currentCgpaInput");
const earnedCreditsInput = document.querySelector("#earnedCreditsInput");
const gradeScaleInput = document.querySelector("#gradeScaleInput");
const courseRows = document.querySelector("#courseRows");
const addCourseRowButton = document.querySelector("#addCourseRow");
const resetCgpaButton = document.querySelector("#resetCgpa");
const cgpaValue = document.querySelector("#cgpaValue");
const semesterGpaValue = document.querySelector("#semesterGpaValue");
const semesterCreditsValue = document.querySelector("#semesterCreditsValue");
const projectedCgpaValue = document.querySelector("#projectedCgpaValue");

function getActiveScale() {
  return gradeScales[gradeScaleInput.value] || gradeScales.campus10;
}

function getGradePoints(grade) {
  const scale = getActiveScale();
  const match = scale.grades.find(([value]) => value === grade);

  return match ? match[1] : 0;
}

function getCourseEntries() {
  return Array.from(courseRows.querySelectorAll(".course-row")).map((row) => ({
    courseCode: row.querySelector(".course-code").value.trim(),
    creditHours: Number(row.querySelector(".course-credit").value),
    grade: row.querySelector(".course-grade").value,
  }));
}

function calculateSemesterGpa(courses) {
  let totalCredits = 0;
  let weightedScore = 0;

  courses.forEach((course) => {
    if (!Number.isFinite(course.creditHours) || course.creditHours <= 0 || !course.grade) {
      return;
    }

    totalCredits += course.creditHours;
    weightedScore += course.creditHours * getGradePoints(course.grade);
  });

  return {
    totalCredits,
    gpa: totalCredits > 0 ? weightedScore / totalCredits : 0,
  };
}

function calculateCgpa(courses, currentCgpa, earnedCredits) {
  const scale = getActiveScale();
  const semester = calculateSemesterGpa(courses);
  const current = Number(currentCgpa);
  const earned = Number(earnedCredits);

  if (
    Number.isFinite(current) &&
    Number.isFinite(earned) &&
    current > 0 &&
    earned > 0 &&
    semester.totalCredits > 0
  ) {
    const projected =
      (current * earned + semester.gpa * semester.totalCredits) /
      (earned + semester.totalCredits);

    return {
      ...semester,
      cgpa: Math.min(projected, scale.max),
    };
  }

  if (Number.isFinite(current) && current > 0 && semester.totalCredits === 0) {
    return {
      ...semester,
      cgpa: Math.min(current, scale.max),
    };
  }

  return {
    ...semester,
    cgpa: semester.gpa,
  };
}

function updateCgpa() {
  const result = calculateCgpa(
    getCourseEntries(),
    currentCgpaInput.value,
    earnedCreditsInput.value,
  );

  semesterGpaValue.textContent = result.gpa.toFixed(2);
  semesterCreditsValue.textContent = String(result.totalCredits);
  projectedCgpaValue.textContent = result.cgpa.toFixed(2);
  cgpaValue.textContent = result.cgpa.toFixed(2);
}

function populateGradeSelect(select) {
  const gradeOptions = getActiveScale().grades.map(([grade, points]) => {
    const option = document.createElement("option");
    option.value = grade;
    option.textContent = `${grade} (${points})`;
    return option;
  });

  select.replaceChildren(new Option("--", ""), ...gradeOptions);
}

function updateGradeSelects() {
  courseRows.querySelectorAll(".course-grade").forEach((select) => {
    const previousValue = select.value;
    populateGradeSelect(select);

    if (Array.from(select.options).some((option) => option.value === previousValue)) {
      select.value = previousValue;
    }
  });

  const max = getActiveScale().max;
  currentCgpaInput.max = String(max);
  currentCgpaInput.placeholder = gradeScaleInput.value === "campus10" ? "8.20" : "3.50";
  updateCgpa();
}

function createCourseRow(course = {}) {
  const row = document.createElement("div");
  const codeLabel = document.createElement("label");
  const creditLabel = document.createElement("label");
  const gradeLabel = document.createElement("label");
  const codeInput = document.createElement("input");
  const creditInput = document.createElement("input");
  const gradeSelect = document.createElement("select");
  const removeButton = document.createElement("button");

  row.className = "course-row";
  row.dataset.courseId = String(nextCourseId);
  nextCourseId += 1;

  codeLabel.textContent = "Course";
  creditLabel.textContent = "Credits";
  gradeLabel.textContent = "Grade";

  codeInput.className = "course-code";
  codeInput.type = "text";
  codeInput.placeholder = "CS101";
  codeInput.value = course.courseCode || "";

  creditInput.className = "course-credit";
  creditInput.type = "number";
  creditInput.min = "0";
  creditInput.max = "6";
  creditInput.step = "1";
  creditInput.placeholder = "3";
  creditInput.value = course.creditHours || "";

  gradeSelect.className = "course-grade";
  populateGradeSelect(gradeSelect);
  gradeSelect.value = course.grade || "";

  removeButton.className = "remove-course";
  removeButton.type = "button";
  removeButton.textContent = "Remove";
  removeButton.addEventListener("click", () => {
    row.remove();

    if (courseRows.children.length === 0) {
      addCourseRow();
    }

    updateCgpa();
  });

  [codeInput, creditInput, gradeSelect].forEach((input) => {
    input.addEventListener("input", updateCgpa);
    input.addEventListener("change", updateCgpa);
  });

  codeLabel.append(codeInput);
  creditLabel.append(creditInput);
  gradeLabel.append(gradeSelect);
  row.append(codeLabel, creditLabel, gradeLabel, removeButton);

  return row;
}

function addCourseRow(course) {
  courseRows.append(createCourseRow(course));
  updateCgpa();
}

function resetCgpaCalculator() {
  currentCgpaInput.value = "";
  earnedCreditsInput.value = "";
  gradeScaleInput.value = "campus10";
  courseRows.replaceChildren();
  updateGradeSelects();
  addCourseRow({ courseCode: "", creditHours: 3, grade: "" });
  addCourseRow({ courseCode: "", creditHours: 3, grade: "" });
  addCourseRow({ courseCode: "", creditHours: 3, grade: "" });
}

if (
  currentCgpaInput &&
  earnedCreditsInput &&
  gradeScaleInput &&
  courseRows &&
  addCourseRowButton &&
  resetCgpaButton &&
  cgpaValue &&
  semesterGpaValue &&
  semesterCreditsValue &&
  projectedCgpaValue
) {
  [currentCgpaInput, earnedCreditsInput].forEach((input) => {
    input.addEventListener("input", updateCgpa);
  });

  gradeScaleInput.addEventListener("change", updateGradeSelects);
  addCourseRowButton.addEventListener("click", () => addCourseRow());
  resetCgpaButton.addEventListener("click", resetCgpaCalculator);
  resetCgpaCalculator();
}
