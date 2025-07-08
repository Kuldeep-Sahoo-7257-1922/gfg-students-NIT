// server.js
import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = 10000;

app.use(express.static("public")); // for frontend

// Recursive fetch from GFG API
async function fetchAllStudents(url, students = []) {
  const response = await fetch(url);
  const data = await response.json();
  students.push(...data.results);

  if (data.next) {
    return fetchAllStudents(data.next, students);
  }
  return students;
}

app.get("/students", async (req, res) => {
  const baseURL =
    "https://practiceapi.geeksforgeeks.org/api/v1/institute/250/students/stats?page_size=10";
  try {
    const allStudents = await fetchAllStudents(baseURL);
    res.json(allStudents);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data from GFG API" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
