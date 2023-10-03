import Select, { OnChangeValue } from "react-select";
import { useEffect, useContext, useState } from "react";
import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "../../axios";
import Info from "../../../../../Nis/frontend/src/layouts/information";
import { AuthContext } from "../../contexts/Auth";



type SubjectOption = { label: string; value: string };
type TeacherOption = { label: string; value: string };
type FeedbackOption ={ label: string; value: string};
type User = {
  FirstName: string
  LastName: string
  citizenshipNumber: string
  SubjectName: string
  TeacherName: string
}

const FeedbackOptions = [
  { value: "parents", label: "Parents" },
  { value: "teacher", label: "Teacher" },
  { value: "everyone", label: "Everyone" },
];

const Days = [
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" },
];


const subjectSchema = Yup.object().shape({  
  Date: Yup.string().nullable(),
  Lesson: Yup.string().required(),
  Address: Yup.string().required(),
  content: Yup.string().required(),
  citizenshipNumber: Yup.string()
    .min(12, "must be exactly 12 digits")
    .max(12, "must be exactly 12 digits")
    .matches(/^[0-9]+$/, "Must be only digits")
    .required(),
});

const Feedback = (): JSX.Element => {


  const authContext = useContext(AuthContext);
  const fixedCitizen = String(authContext.citizenshipNumber);

  const [selectedSubject, setSelectedSubject] = useState<SubjectOption | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherOption | null>(null);
  const [existingTeachername, setExistingteachername] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [formatdate, setFormatdate] = useState<string | null>(null);
  const [selectedFeedbackOptions, setSelectedFeedbackOptions] = useState<FeedbackOption | null>(null);


  const handleSubjectChange = (selectedOption: SubjectOption | null) => {
    setSelectedSubject(selectedOption);
    setSelectedTeacher(null);
    axios
    .get(`/selection/getsubject?authnumber=${fixedCitizen}&SubjectName=${selectedOption?.label}`)
    .then((res) => {
      setExistingteachername(res.data.teachers)
      
    })
    .catch((err) => {
      console.log('Error fetching existing subject names', err)
    });
    

  };
  const handleFeedbackChange = (selectedOption: FeedbackOption | null) => {
    setSelectedFeedbackOptions(selectedOption)
    
  }
 


  const getSubjectOptions = (): SubjectOption[] => {
    switch (selectedDay) {
      case "Monday":
        return [
          { label: "Physics", value: "phy" },
          { label: "Computer Science", value: "cmp" },
        ];
      case "Tuesday":
        return [
          { label: "Math", value: "math" },
          { label: "P.E.", value: "pe" },
        ];
      default:
        return [];
    }
  };

  useEffect(() => {
    setSelectedFeedbackOptions(null);
    setSelectedSubject(null);
  }, [selectedDay]);
  

  const teacher = existingTeachername.map((teacher) => (teacher.TeacherName))
  const [error, setError] = useState<any>("");
  const [success, setSuccess] = useState<string>("");
  const textarea = {
    height: "100px",
    width: "500px",
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = event.target.value;
    const dateObj = new Date(selectedDate);
    const dayOfWeek = Days[dateObj.getDay()].value;
    const [year, month, day] = selectedDate.split("-");
    const formattedDate = `${day}.${month}.${year}`;
    setSelectedDay(dayOfWeek);
    setFormatdate(formattedDate);
    setExistingteachername([]);
    setSelectedTeacher(null);
  };

  return (
    <div>
  <h1 className="title-large">Your Feedback!</h1>
  <Info error={error} success={success}>
    <div className="form-container">
      <h1 className="title-small">Select Day: </h1>
      <Formik
        initialValues={{
          Lesson: "",
          Date: "",
          content: "",
          Address: "",
          citizenshipNumber: fixedCitizen,
        }}
        validationSchema={subjectSchema}
        onSubmit={({ Lesson, Date, content,Address, citizenshipNumber}) => {
          setIsLoading(true);
          
          axios
            .post("/selection/feedback", {
              Lesson,
              Date: formatdate,
              content,
              Address,
              citizenshipNumber,
            })
            .then((res) => {
              setError("");
              setSuccess("Your feedback was submitted successfully!");
            
            })
            .catch((err) => {
              let error = err.message;
              if (err?.response?.data) error = JSON.stringify(err.response.data);
              setError(error.slice(0, 50));
            });
            
            
        }}
      >
        {({ values, errors, touched, handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <div>
            <label className="text-small" htmlFor="Date">Date: </label>
                  <input
                    type="Date"
                    id="Date"
                    name="Date"
                    value={values.Date}
                    onChange={handleDateChange}
                  />
            </div>
                  <div className="form-error-text">
              {touched.Date && errors.Date ? errors.Date : null}
            </div>
            <div style={{marginBottom: "20px", marginTop:"20px"}}>
                  <span className="text-small">Day: </span>
                  <span><label className="text-normal" htmlFor="Day">{selectedDay} {formatdate}</label></span>
                </div>
            <label className="text-small">Select lesson: </label>    
            <Select
              className="text-normal"
              id="Lesson"
              options={getSubjectOptions()}
              value={selectedSubject}
              onChange={(option) => {
                handleSubjectChange(option);
                setFieldValue("Lesson", option ? option.label : "");
              }}
            />
            <div className="form-error-text">
              {touched.Lesson && errors.Lesson ? errors.Lesson : null}
            </div>
            <div style={{marginBottom: "20px", marginTop:"20px"}}>
              <span className="text-small">Teacher: </span>
              <span><label className="text-normal">{teacher}</label></span>
           
            </div>
            
            {selectedSubject && (
              <div>
                <label className="text-small">Select for whom your feedback will be visible: </label>
                <Select
                  className="text-normal"
                  id="Address"
                  options={FeedbackOptions}
                  value={selectedFeedbackOptions}
                  onChange={(option) => {
                    handleFeedbackChange(option);
                    setFieldValue("Address", option ? option.label : "");
                  }}
                />
                <div className="form-error-text">
                  {touched.Address && errors.Address? errors.Address : null}
                </div>
              </div>
            )}
             <hr style={{ color: '#4daaa7', backgroundColor: '#4daaa7', height: 1.3, width: '87%' }} />
            <div className="student-list">
              <h2 className="text-normal">Write your feedback.</h2>
              <textarea  
                id="content"
                name="content"
                placeholder="Write here..."
                style={textarea}
                rows={4}
                cols={40}
                value={values.content}
                onChange={(e) => setFieldValue("content", e.target.value)}/>
                <div className="form-error-text" style={{marginBottom: "20px"}}>
                  {touched.content && errors.content? errors.content: null}
                </div>
            </div>
            <button className="button-primary" type="submit">
               Send
            </button>
          </form>
        )}
      </Formik>
    </div>
  </Info>
</div>

  );
};

export default Feedback;
