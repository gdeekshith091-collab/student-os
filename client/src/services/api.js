const API_BASE_URL = "http://localhost:5000/api/v1";

export const createUser = async (data) => {
  const response = await fetch(
    `${API_BASE_URL}/users/createUser`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to create user"
    );
  }

  return result;
};

export const getUser = async (firebaseUid) => {
  const response = await fetch(
    `${API_BASE_URL}/users/getUser/${firebaseUid}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch user"
    );
  }

  return result;
};

export const updateSemester = async (data) => {
  const response = await fetch(
    `${API_BASE_URL}/users/semester`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to update semester"
    );
  }

  return result;
};
export const createAssignment = async (data) => {
  const response = await fetch(
    `${API_BASE_URL}/assignments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to create assignment"
    );
  }

  return result;
};

export const getAssignments = async (firebaseUid) => {
  const response = await fetch(
    `${API_BASE_URL}/assignments/${firebaseUid}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch assignments"
    );
  }

  return result;
};

export const updateAssignmentStatus = async (
  id,
  firebaseUid,
  status
) => {
  const response = await fetch(
    `${API_BASE_URL}/assignments/${id}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firebaseUid,
        status,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to update assignment"
    );
  }

  return result;
};

export const deleteAssignment = async (
  id,
  firebaseUid
) => {
  const response = await fetch(
    `${API_BASE_URL}/assignments/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firebaseUid,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to delete assignment"
    );
  }

  return result;
};
export const getAcademicRisk = async (firebaseUid) => {
  const response = await fetch(
    `${API_BASE_URL}/assignments/${firebaseUid}/risk`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to calculate academic risk"
    );
  }

  return result;
};
export const getNextBestAction = async (firebaseUid) => {
  const response = await fetch(
    `${API_BASE_URL}/priority/${firebaseUid}/next`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to get next best action"
    );
  }

  return result;
};
export const createCareerGoal = async (data) => {
  const response = await fetch(
    `${API_BASE_URL}/career-goals`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to create career goal"
    );
  }

  return result;
};


export const getCareerGoal = async (firebaseUid) => {
  const response = await fetch(
    `${API_BASE_URL}/career-goals/${firebaseUid}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch career goal"
    );
  }

  return result;
};
export const getSkillsByCareer = async (career) => {
  const response = await fetch(
    `${API_BASE_URL}/skills/career/${encodeURIComponent(career)}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch career skills"
    );
  }

  return result;
};
export const saveSkillAssessment = async (data) => {
  const response = await fetch(
    `${API_BASE_URL}/skill-assessments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to save skill assessment"
    );
  }

  return result;
};

export const getStudentSkills = async (firebaseUid) => {
  const response = await fetch(
    `${API_BASE_URL}/skill-assessments/${firebaseUid}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to fetch skill assessments"
    );
  }

  return result;
};
export const getSkillGaps = async (firebaseUid) => {
  const response = await fetch(
    `${API_BASE_URL}/skill-gaps/${firebaseUid}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to calculate skill gaps"
    );
  }

  return result;
};
export const getDynamicPriority = async (firebaseUid) => {
  const response = await fetch(
    `${API_BASE_URL}/dynamic-priority/${firebaseUid}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to get dynamic priority"
    );
  }

  return result;
};
export const createStudySession = async (data) => {
  const response = await fetch(
    `${API_BASE_URL}/study-sessions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to create study session"
    );
  }

  return result;
};


export const startStudySession = async (
  id,
  firebaseUid
) => {
  const response = await fetch(
    `${API_BASE_URL}/study-sessions/${id}/start`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firebaseUid,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to start study session"
    );
  }

  return result;
};


export const completeStudySession = async (
  id,
  firebaseUid
) => {
  const response = await fetch(
    `${API_BASE_URL}/study-sessions/${id}/complete`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firebaseUid,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to complete study session"
    );
  }

  return result;
};
export const getBehavior = async (firebaseUid) => {
  const response = await fetch(
    `${API_BASE_URL}/behavior/${firebaseUid}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to fetch behavior insights"
    );
  }

  return result;
};
// =========================================
// PROGRESS INTELLIGENCE
// =========================================

export const getProgress = async (firebaseUid) => {
  const response = await fetch(
    `${API_BASE_URL}/progress/${firebaseUid}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to fetch student progress"
    );
  }

  return result;
};
// =========================================
// TODAY'S ROADMAP
// =========================================

export const getTodayRoadmap = async (firebaseUid) => {
  const response = await fetch(
    `${API_BASE_URL}/today-roadmap/${firebaseUid}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to fetch today's roadmap"
    );
  }

  return result;
};
// =========================================
// EXAMS
// =========================================

export const createExam = async (data) => {
  const response = await fetch(
    `${API_BASE_URL}/exams`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to create exam"
    );
  }

  return result;
};


export const getExams = async (firebaseUid) => {
  const response = await fetch(
    `${API_BASE_URL}/exams/${firebaseUid}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch exams"
    );
  }

  return result;
};


export const updateExamStatus = async (
  id,
  status
) => {
  const response = await fetch(
    `${API_BASE_URL}/exams/${id}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to update exam status"
    );
  }

  return result;
};


export const deleteExam = async (id) => {
  const response = await fetch(
    `${API_BASE_URL}/exams/${id}`,
    {
      method: "DELETE",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to delete exam"
    );
  }

  return result;
};
// =========================================
// TIMETABLE
// =========================================

export const createTimetableEntry = async (data) => {
  const response = await fetch(
    `${API_BASE_URL}/timetable`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to create timetable entry"
    );
  }

  return result;
};

export const getTimetable = async (firebaseUid) => {
  const response = await fetch(
    `${API_BASE_URL}/timetable/${firebaseUid}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to fetch timetable"
    );
  }

  return result;
};

export const updateTimetableEntry = async (
  id,
  data
) => {
  const response = await fetch(
    `${API_BASE_URL}/timetable/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to update timetable entry"
    );
  }

  return result;
};

export const deleteTimetableEntry = async (
  id
) => {
  const response = await fetch(
    `${API_BASE_URL}/timetable/${id}`,
    {
      method: "DELETE",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to delete timetable entry"
    );
  }

  return result;
};
// =========================================
// ATTENDANCE
// =========================================

export const createAttendance = async (data) => {
  const response = await fetch(
    `${API_BASE_URL}/attendance`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to create attendance"
    );
  }

  return result;
};

export const getAttendance = async (
  firebaseUid
) => {
  const response = await fetch(
    `${API_BASE_URL}/attendance/${firebaseUid}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to fetch attendance"
    );
  }

  return result;
};

export const updateAttendance = async (
  id,
  data
) => {
  const response = await fetch(
    `${API_BASE_URL}/attendance/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to update attendance"
    );
  }

  return result;
};

export const deleteAttendance = async (
  id
) => {
  const response = await fetch(
    `${API_BASE_URL}/attendance/${id}`,
    {
      method: "DELETE",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to delete attendance"
    );
  }

  return result;
};
export const getAttendanceRisk = async (
  firebaseUid
) => {
  const response = await fetch(
    `${API_BASE_URL}/attendance-risk/${firebaseUid}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to fetch attendance risk"
    );
  }

  return result;
};
// =========================================
// AI TIMETABLE SCANNER
// =========================================

export const scanTimetable = async (
  firebaseUid,
  file
) => {
  const formData = new FormData();

  formData.append(
    "firebaseUid",
    firebaseUid
  );

  formData.append(
    "file",
    file
  );

  const response = await fetch(
    `${API_BASE_URL}/timetable/scan`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to scan timetable"
    );
  }

  return result;
};
export const getProfile = async (firebaseUid) => {
  const response = await fetch(
    `${API_BASE_URL}/profile/${firebaseUid}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch profile"
    );
  }

  return data;
};

export const saveProfile = async (profileData) => {
  const response = await fetch(
    `${API_BASE_URL}/profile/${profileData.firebaseUid}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to save profile"
    );
  }

  return data;
};