const apiUrl = "http://localhost:5000/students";

// 📌 ค้นหานักศึกษา
async function searchStudents() {
    const query = document.getElementById("searchBox").value.trim();
    if (query === "") {
        fetchStudents();
        return;
    }

    try {
        const res = await fetch(`${apiUrl}/search?query=${query}`);
        if (!res.ok) throw new Error("ไม่พบข้อมูล");
        const students = await res.json();
        renderStudents(students);
    } catch (error) {
        console.error("Error:", error);
    }
}

// 📌 แสดงข้อมูลนักศึกษา
function renderStudents(students) {
    const list = document.getElementById("studentList");
    
    if (students.length === 0) {
        list.innerHTML = `<li>❌ ไม่พบข้อมูล</li>`;
        return;
    }

    list.innerHTML = students.map(student => 
        `<li>${student.studentId} - ${student.firstName} ${student.lastName}  
        <button onclick="editStudent('${student._id}', '${student.studentId}', '${student.firstName}', '${student.lastName}')">✏️ EDIT</button>
        <button onclick="deleteStudent('${student._id}')">❌ DELETE</button>
        </li>`).join("");
}

// 📌 โหลดข้อมูลทั้งหมด
async function fetchStudents() {
    const res = await fetch(apiUrl);
    const students = await res.json();
    renderStudents(students);
}

// 📌 ลบ
async function deleteStudent(id) {
    await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    fetchStudents();
}

// 📌 แก้ไข
function editStudent(id, studentId, firstName, lastName) {
    document.getElementById("studentId").value = studentId;
    document.getElementById("firstName").value = firstName;
    document.getElementById("lastName").value = lastName;
    document.getElementById("editingId").value = id;
}

fetchStudents();
