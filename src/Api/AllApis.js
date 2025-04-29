import axios from "axios";
import dayjs from "dayjs";
import moment from "moment";

// Function to fetch class attendance data
export const getPoints = async (params) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/attendance/class-attendance`, 
      {
        params: {
          teacherId: params.teacherId || '',
          assistantTeachers:params.assistantTeachers ||  "",
          students:params.students || "",
          subjectId:params.subjectId  || "",
          academicYearId: params.academicYearId || "",
          gradeId:params.gradeId  || "",
          sectionId: params.sectionId ||  "",
          date: moment().format("YYYY-MM-DD"),
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    
    return response?.data?.data; 
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch data");
  }
};



export const getTimeTableList = async (academicYearId) => {
  try {
    const response = await axios.get(
      `${
        process.env.REACT_APP_DEV_BASE_URL
      }/api/v1/time-table/teacher/${localStorage.getItem(
        "userId"
      )}?day=${dayjs().format(
        "dddd"
      )}&date=${dayjs().format("YYYY-MM-DD")}&academicYearId=${academicYearId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );
    
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching users:", error);
 
  }
};



export const getStages = async (academicYearId) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/stage-grade-section/stage`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
   
      return res?.data?.records;
    
  } catch (error) {
    console.error("Error fetching stages:", error);
  }
};



export const getWorkingDayId = async (stages , academicYearId) => {
  try {
    const res = await axios.get(
      `${
        process.env.REACT_APP_DEV_BASE_URL
      }/api/v1/academics/working-day?stageId=${stages}&academicYearId=${academicYearId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    return res?.data?.data;
  } catch (error) {
    console.error("Error fetching stages:", error);
  }
};



export const getGrades = async (id) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/stage-grade-section/stage/${id}/grade`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    return res?.data?.records;
  } catch (error) {
    console.log(error);
  }
};



export const getSections = async ( stages , sid) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/stage-grade-section/stage/${stages}/grade/${sid}/section`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    return res?.data?.records;
  } catch (error) {
    console.log(error);
  }
};



export  const getUsers = async (grades ,section ) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/stage-grade-section/get-student-by-grade-section?gradeId=${grades}&sectionId=${section}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const dataWithSelection = response?.data?.data.map((item) => ({
        ...item,
        selected: true,
      }));
      return dataWithSelection;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
};
  


export const markAttendanceAPI = async (data) => {
  const response = await axios.post(
    `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/attendance/class-attendance`,
    data,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    }
  );
  return response.data;
};




export const getClassAttendanceAPI = async ( queryKey ) => {
  console.log("coming inside hte daa ok then" , queryKey)
  const { page, pageSize, filterGrade, filterSection, academicYearId, authState, token } = queryKey;

  console.log(page, pageSize, filterGrade, filterSection, academicYearId, authState, token , "coming inside hte daa ok then")
  const response = await axios.get(
    `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/attendance/class-attendance?date=${moment().format(
      "YYYY-MM-DD"
    )}&teacherId=${localStorage.getItem('userId')}&assistantTeachers=&students=&subjectId=&gradeId=${filterGrade || ''}&sectionId=${filterSection || ''}&academicYearId=${
      academicYearId == authState?.startYearId ? academicYearId : authState?.startYearId
    }&page=${page}&limit=${pageSize}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.data; 
};


