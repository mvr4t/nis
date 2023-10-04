import Select, { OnChangeValue } from "react-select";
import { useEffect, useContext, useState } from "react";
import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import axioss from "../../axios";
import Info from "../../layouts/information";
import { AuthContext } from "../../contexts/Auth";
import axios, {AxiosRequestConfig} from 'axios';

type SubjectOption = { label: string; value: string };
type TeacherOption = { label: string; value: string };
type GradeOption = { label: string; value: string};
type CuratorOption = {label: string; value: string};
type User = {
  FirstName: string
  LastName: string
  citizenshipNumber: string
  SubjectName: string
  Grade: string
  CuratorName: string
}





const curatorSchema = Yup.object().shape({
  CuratorName: Yup.string().required(),
  citizenshipNumber: Yup.string()
    .min(12, "must be exactly 12 digits")
    .max(12, "must be exactly 12 digits")
    .matches(/^[0-9]+$/, "Must be only digits")
    .required(),
});

const subjectSchema = Yup.object().shape({
  SubjectName: Yup.string().required(),
  TeacherName: Yup.string().required(),
  citizenshipNumber: Yup.string()
    .min(12, "must be exactly 12 digits")
    .max(12, "must be exactly 12 digits")
    .matches(/^[0-9]+$/, "Must be only digits")
    .required(),
});

const Grade = [
  { label: "7", value: "7" },
  { label: "8", value: "8" },
  { label: "9", value: "9" },
  { label: "10", value: "10" },
  { label: "11", value: "11" },
  { label: "12", value: "12" },
];

const CuratorNames = [
  { label: "Assel Seidulaevna", value: "A" },
  { label: "Dina Nurlankyzy", value: "B" },
];
const SubjectNames = [
  { label: "Physics", value: "phy" },
  { label: "Math", value: "math" },
];

const Curator = (): JSX.Element => {
  const [selectedOption, setSelectedOption] = useState<
  CuratorOption | null
  >(null);
  const [chatId, setChatId] = useState<number | null>(null);
  const  addMember = async () => {
    try {
      if(authContext.FirstName === " "){
        console.log("empty")
      }
      else{const data = {
        username: authContext.FirstName.toString(),         
      };
      const config: AxiosRequestConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://api.chatengine.io/chats/${chatId}/people/`,
        headers: {
            'Project-ID': "ebf810db-a728-45d2-bb20-894fcae82e5f", 
            'User-Name': "Admin", 
            'User-Secret': "john@gmail.com"
        },
        data: data,
      }; 
      
      const response = await axios(config);
      console.log('Member added:', response.data);}
      
    } catch (error) {
      console.log('Error member does not added:', error || error );
    }
  };
  


  const authContext = useContext(AuthContext);
  const fixedCitizen = String(authContext.citizenshipNumber);

  const [selectedGrade , setSelectedGrade] = useState<GradeOption | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<SubjectOption | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherOption | null>(null);
  const [setgrade, setGradeData] = useState<User[]>([]);
  const [students,  setStudentData] = useState<User[]>([]);
  const [allgrade, setFullGradeData] = useState<User[]>([]);
  const [classgrades, setClassgrade] = useState<User[]>([]);
  const [studentsubj, setStudentSubjData] = useState<User[]>([]);
  const [existingCitizenshipNumbers, setExistingCitizenshipNumbers] = useState<User[]>([]);
  const [existingsubjectnames, setExistingsubjectnames] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubjectChange = (selectedOption: SubjectOption | null) => {
    setSelectedSubject(selectedOption);
    setSelectedTeacher(null);
    axioss
    .get(`/selection/getstudents?authnumber=${fixedCitizen}`)
    .then((res) => {
      setGradeData(res.data.grade);
    })
    .catch((err) => {
      console.error(err);
    });

  };
  const handleGradeChange = (selectedOption: GradeOption | null) =>{
    setSelectedGrade(selectedOption);
    setSelectedOption(null);
    setStudentData([]);
  };

  useEffect(() => {
    axioss.get('/selection/getcitizenshipNumber')
      .then((res) => {
        
        setExistingCitizenshipNumbers(res.data.citizennumber);
      })
      .catch((err) => {
        console.error('Error fetching existing citizenshipNumbers:', err);
      });

    axioss
      .get(`/selection/getsubject?authnumber=${fixedCitizen}`)
      .then((res) => {
        setExistingsubjectnames(res.data.subjects)
      })
      .catch((err) => {
        console.log('Error fetching existing subject names', err)
      });
  }, []);

  const handleTeacherChange = (selectedOption: TeacherOption | null) => {
    setSelectedTeacher(selectedOption);
    axioss
    .get(`/selection/getsubject?TeacherName=${selectedOption?.label}&SubjectName=${selectedSubject?.label}`)
    .then((res) => {
      setClassgrade(res.data.classgrades);
  
      setStudentSubjData(res.data.studentnames);
    })
    .catch((err) => {
      console.error(err);
    });
  };

  useEffect(() => {
    if (selectedTeacher && classgrades.length > 0) {
      const teacherHasMaxStudents =
       classgrades.filter((grd) => grd.Grade === setgrade.map((grade)=>(grade.Grade)).toString()).length >= 12
      if (teacherHasMaxStudents) {
        setError("The selected teacher has reached the maximum student limit for this grade.");
      } else {
        setError("");
      }
    }
  }, [selectedTeacher, classgrades]);

  const getCuratorOptions = (): CuratorOption[] => {
    switch (selectedGrade?.value) {
      case "12":
        return [
          {label: "Assel Seidulaevna", value: "A" },
          {label: "Dina Nurlankyzy", value: "B"}
        ];
      case "11":
        return [
          {label: "Vladislav", value: "A"}
        ];
      default:
        return [];
    }
  };
  
  const grd = setgrade.map((grade) => (grade.Grade));
  const getTeacherOptions = (): TeacherOption[] => {
    switch (selectedSubject?.value) {
      case "phy":
        if( grd.toString() === "12A") {
        return [
          { label: "Gulmira", value: "gulmira" },
          { label: "Bakarbek", value: "bakarbek" },
        ];
      }
      else if ( grd.toString() === "12B") {
        return[
          { label: "Ahmet", value: "ahmet" },
        ];
      }
      break;
      case "math":
        if(grd.toString() === "12A") 
        {
        return [
          { label: "Zhanat", value: "zhanat" },
          { label: "Nurbol", value: "nurbol" },
        ];
      }
      else if(grd.toString() === "12B")
      {
        return[
          { label: "Korkem", value: "korkem" },
        ];
      }
      break;
      default:
        return [];
    }
    return [];
  };

  const handleCuratorChange = async (
    selection: OnChangeValue<typeof CuratorNames[0], false>
  ) => {
    setSelectedOption(selection);
  
    try {
      const res = await axioss.get(`/selection/getstudents?CuratorName=${selection?.label}`);
      setFullGradeData(res.data.allgrade);
      setStudentData(res.data.citizenshipNumbers);
      setGradeData(res.data.grade);
     
  
    } catch (err) {
      console.error(err);
    }
   console.log(selectedGrade?.label);
    if (selection?.label === "Assel Seidulaevna" && selectedGrade?.label === "12") {
      setChatId(206881);
    } else if (selection?.label === "Dina Nurlankyzy" && selectedGrade?.label === "12") {
      setChatId(206932);
    } else {
      setChatId(null);
    }
  };  
  
  useEffect(() => {
    if (selectedGrade && allgrade.length > 0) {
      const curatorHasMaxStudents =
       allgrade.filter((grd) => grd.Grade === `${selectedGrade?.label}${selectedOption?.value}`).length >= 24
      if (curatorHasMaxStudents) {
        setError("The selected curator has reached the maximum student limit for this grade.");
      } else {
        setError("");
      }
    }
  }, [selectedGrade, allgrade]);

  const [error, setError] = useState<any>("");
  const [success, setSuccess] = useState<string>("");
  const [curatorFormVisible, setCuratorFormVisible] = React.useState(false);

  return (
    <div>
  <h1 className="title-large">WELCOME!</h1>
  <Info error={error} success={success}>
    {!curatorFormVisible && !existingCitizenshipNumbers.some((option) => option.citizenshipNumber === fixedCitizen) ? (
    <div className="form-container">
      
      <h2 className="title-small">Choose Grade: </h2>
      <Formik
        initialValues={{
          CuratorName: "",
          citizenshipNumber: fixedCitizen,
          Grade: "",
        }}
        validationSchema={curatorSchema}
        onSubmit={({Grade, CuratorName, citizenshipNumber}, {setSubmitting}) => {
          axioss
            .post("/selection/choicecurator", {
              CuratorName,
              citizenshipNumber,
              Grade: `${selectedGrade?.label}${selectedOption?.value}`,
            })
            .then((res) => {
              setError("");
              setSuccess("Curator name inserted successfully!");
              setCuratorFormVisible(true)


              addMember();
          

            })
            .catch((err) => {
              let error = err.message;
              if (err?.response?.data) error = JSON.stringify(err.response.data);
              setError(error.slice(0, 50));
            })

            .finally(() => {
              setSubmitting(false);
            });
            
        }}
      >
        {({ errors, touched, handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <div style={{marginBottom: "30px"}}>
            <Select
              id="Grade"
              placeholder="Select your Grade..."
              options={Grade}
              value={selectedGrade}
              onChange={(option) => {
                handleGradeChange(option);
                setFieldValue("Grade", option ? option.label : "");
              }}
            />
            <div className="form-error-text">
              {touched.Grade && errors.Grade ? errors.Grade : null}
            </div>
            </div>
            <h2 className="title-small">Select Curator: </h2>
            <Select
              id="CuratorName"
              options={getCuratorOptions()}
              value={selectedOption}
              onChange={(option) => {
                handleCuratorChange(option);
                setFieldValue("CuratorName", option ? option.label : "");
              }}
            />
            <div className="form-error-text">
              {touched.CuratorName && errors.CuratorName ? errors.CuratorName : null}
            </div>
            <div className="student-list">
              <h2 className="text-normal">List of Students who have chosen {selectedOption?.label}</h2>
              {students.length > 0 ? (
                <ol>
                  {students.map((student, index) => (
                    <li className="text-normal" key={index}>{student.FirstName} {student.LastName}</li>
                  ))}
                </ol>
              ) : (
                <p className="text-normal">No students available</p>
              )}
            </div>
            <button className={`button-primary ${error ? "disabled-button" : ""}`} type="submit" disabled={!!error}>
              Insert Curator
            </button>

          </form>
        )}
      </Formik>
    </div>
    ):(
    <div className="form-container">
      <h2 className="title-small">Select Subject and Teacher: </h2>
      <Formik
        initialValues={{
          SubjectName: "",
          TeacherName: "",
          citizenshipNumber: fixedCitizen,
        }}
        validationSchema={subjectSchema}
        onSubmit={({ SubjectName, TeacherName , citizenshipNumber}) => {
          setIsLoading(true);
          
          axioss
            .post("/selection/choicesubject", {
              SubjectName,
              TeacherName,
              citizenshipNumber,
            })
            .then((res) => {
              setError("");
              setSuccess("Subject and teacher name inserted successfully!");
            
            })
            .catch((err) => {
              let error = err.message;
              if (err?.response?.data) error = JSON.stringify(err.response.data);
              setError(error.slice(0, 50));
            })
            .finally(() => {
              setIsLoading(false);
    
              
            });
           
            
        }}
      >
        {({ errors, touched, handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <Select
              id="SubjectName"
              options={SubjectNames.filter((subj) => !existingsubjectnames.some((s) => s.SubjectName === subj.label))}
              value={selectedSubject}
              onChange={(option) => {
                handleSubjectChange(option);
                setFieldValue("SubjectName", option ? option.label : "");
              }}
            />
            <div className="form-error-text">
              {touched.SubjectName && errors.SubjectName ? errors.SubjectName : null}
            </div>
            <hr style={{ color: '#4daaa7', backgroundColor: '#4daaa7', height: 1.3, width: '87%' }} />
            {selectedSubject && (
              <div>
                <Select
                  id="TeacherName"
                  options={getTeacherOptions()}
                  value={selectedTeacher}
                  onChange={(option) => {
                    handleTeacherChange(option);
                    setFieldValue("TeacherName", option ? option.label : "");
                  }}
                />
                <div className="form-error-text">
                  {touched.TeacherName && errors.TeacherName ? errors.TeacherName : null}
                </div>
              </div>
            )}
            <div className="student-list">
              <h2 className="text-normal">List of Students who have chosen {selectedSubject?.label} with teacher {selectedTeacher?.label}</h2>
              {studentsubj.length > 0 ? (
                <ol>
                  {studentsubj.map((student, index) => (
                    <li className="text-normal" key={index}>{student.FirstName} {student.LastName}</li>
                  ))}
                </ol>
              ) : (
                <p className="text-normal">No students available</p>
              )}
            </div>
            <button className={`button-primary ${error ? "disabled-button" : ""}`} type="submit" disabled={!!error}>
              Insert Subject and Teacher
            </button>
           
          </form>
          
        )}
      </Formik>
    </div>
    )}
  </Info>
</div>

  );
};

export default Curator;
