import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function UpdateCourse() {
  const { courseId } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [materials, setMaterials] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [coursePlan, setCoursePlan] = useState([]);
  const [codingProblems, setCodingProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const { data } = await api.get(`/api/v1/course/${courseId}`, {
          withCredentials: true,
        });
        console.log('Fetched course data:', data);
        setTitle(data.course.title);
        setDescription(data.course.description);
        setPrice(data.course.price);
        setImage(data.course.image.url);
        setImagePreview(data.course.image.url);
        
        // Ensure materials is always an array
        const courseMaterials = Array.isArray(data.course.materials) ? data.course.materials : [];
        console.log('Setting materials:', courseMaterials);
        setMaterials(courseMaterials.length > 0 ? courseMaterials : []);

        // Ensure quiz is always an array
        const courseQuiz = Array.isArray(data.course.quiz) ? data.course.quiz : [];
        console.log('Setting quiz:', courseQuiz);
        setQuiz(courseQuiz.length > 0 ? courseQuiz : []);

        // Ensure coursePlan is always an array
        const coursePlanData = Array.isArray(data.course.coursePlan) ? data.course.coursePlan : [];
        console.log('Setting course plan:', coursePlanData);
        setCoursePlan(coursePlanData.length > 0 ? coursePlanData : []);

        // Ensure codingProblems is always an array
        const courseCodingProblems = Array.isArray(data.course.codingProblems) ? data.course.codingProblems : [];
        console.log('Setting coding problems:', courseCodingProblems);
        setCodingProblems(courseCodingProblems.length > 0 ? courseCodingProblems : []);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching course:', error);
        toast.error("Failed to fetch course data");
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [courseId]);

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };

  const handleAddMaterial = () => {
    setMaterials([...materials, { title: "", link: "", type: "video" }]);
  };

  const handleRemoveMaterial = (index) => {
    const newMaterials = materials.filter((_, i) => i !== index);
    setMaterials(newMaterials);
  };

  const handleMaterialChange = (index, field, value) => {
    const newMaterials = [...materials];
    newMaterials[index][field] = value;
    setMaterials(newMaterials);
  };

  const handleAddQuestion = () => {
    setQuiz([
      ...quiz,
      {
        questionNumber: quiz.length + 1,
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        explanation: ""
      }
    ]);
  };

  const handleRemoveQuestion = (index) => {
    const newQuiz = quiz.filter((_, i) => i !== index);
    // Recalculate question numbers
    const updatedQuiz = newQuiz.map((q, i) => ({
      ...q,
      questionNumber: i + 1
    }));
    setQuiz(updatedQuiz);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuiz = [...quiz];
    newQuiz[index][field] = value;
    setQuiz(newQuiz);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuiz = [...quiz];
    newQuiz[questionIndex].options[optionIndex] = value;
    setQuiz(newQuiz);
  };

  const handleAddCoursePlan = () => {
    setCoursePlan([
      ...coursePlan,
      {
        chapter: coursePlan.length + 1,
        title: "",
        description: "",
        duration: "",
        topics: []
      }
    ]);
  };

  const handleRemoveCoursePlan = (index) => {
    const newPlan = coursePlan.filter((_, i) => i !== index);
    // Recalculate chapter numbers
    const updatedPlan = newPlan.map((p, i) => ({
      ...p,
      chapter: i + 1
    }));
    setCoursePlan(updatedPlan);
  };

  const handleCoursePlanChange = (index, field, value) => {
    const newPlan = [...coursePlan];
    newPlan[index][field] = value;
    setCoursePlan(newPlan);
  };

  const handleAddTopic = (planIndex) => {
    const newPlan = [...coursePlan];
    if (!newPlan[planIndex].topics) {
      newPlan[planIndex].topics = [];
    }
    newPlan[planIndex].topics.push("");
    setCoursePlan(newPlan);
  };

  const handleTopicChange = (planIndex, topicIndex, value) => {
    const newPlan = [...coursePlan];
    newPlan[planIndex].topics[topicIndex] = value;
    setCoursePlan(newPlan);
  };

  const handleRemoveTopic = (planIndex, topicIndex) => {
    const newPlan = [...coursePlan];
    newPlan[planIndex].topics = newPlan[planIndex].topics.filter((_, i) => i !== topicIndex);
    setCoursePlan(newPlan);
  };

  // Coding Problems handlers
  const handleAddCodingProblem = () => {
    setCodingProblems([
      ...codingProblems,
      {
        problemNumber: codingProblems.length + 1,
        title: "",
        description: "",
        starterCode: "",
        testCases: [{ input: "", expectedOutput: "" }],
        difficulty: "Easy",
        hints: [""]
      }
    ]);
  };

  const handleRemoveCodingProblem = (index) => {
    const newProblems = codingProblems.filter((_, i) => i !== index);
    const updatedProblems = newProblems.map((p, i) => ({
      ...p,
      problemNumber: i + 1
    }));
    setCodingProblems(updatedProblems);
  };

  const handleCodingProblemChange = (index, field, value) => {
    const newProblems = [...codingProblems];
    newProblems[index][field] = value;
    setCodingProblems(newProblems);
  };

  const handleAddTestCase = (problemIndex) => {
    const newProblems = [...codingProblems];
    newProblems[problemIndex].testCases.push({ input: "", expectedOutput: "" });
    setCodingProblems(newProblems);
  };

  const handleTestCaseChange = (problemIndex, testCaseIndex, field, value) => {
    const newProblems = [...codingProblems];
    newProblems[problemIndex].testCases[testCaseIndex][field] = value;
    setCodingProblems(newProblems);
  };

  const handleRemoveTestCase = (problemIndex, testCaseIndex) => {
    const newProblems = [...codingProblems];
    newProblems[problemIndex].testCases = newProblems[problemIndex].testCases.filter((_, i) => i !== testCaseIndex);
    setCodingProblems(newProblems);
  };

  const handleAddHint = (problemIndex) => {
    const newProblems = [...codingProblems];
    newProblems[problemIndex].hints.push("");
    setCodingProblems(newProblems);
  };

  const handleHintChange = (problemIndex, hintIndex, value) => {
    const newProblems = [...codingProblems];
    newProblems[problemIndex].hints[hintIndex] = value;
    setCodingProblems(newProblems);
  };

  const handleRemoveHint = (problemIndex, hintIndex) => {
    const newProblems = [...codingProblems];
    newProblems[problemIndex].hints = newProblems[problemIndex].hints.filter((_, i) => i !== hintIndex);
    setCodingProblems(newProblems);
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    
    if (!title || !description || !price) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    
    // Only append image if a new file was selected
    if (image instanceof File) {
      formData.append("image", image);
    }
    
    // Filter out empty materials and add to formData
    const validMaterials = materials.filter(m => m.title && m.link);
    console.log('UpdateCourse: Raw materials:', materials);
    console.log('UpdateCourse: Valid materials to send:', validMaterials);
    formData.append("materials", JSON.stringify(validMaterials));
    console.log('UpdateCourse: Materials JSON:', JSON.stringify(validMaterials));

    // Filter out empty quiz questions and add to formData
    const validQuiz = quiz.filter(q => q.question && q.correctAnswer && q.options.some(o => o));
    console.log('UpdateCourse: Valid quiz questions:', validQuiz);
    formData.append("quiz", JSON.stringify(validQuiz));

    // Filter out empty course plan chapters and add to formData
    const validCoursePlan = coursePlan.filter(p => p.title && (p.topics && p.topics.some(t => t)));
    console.log('UpdateCourse: Valid course plan:', validCoursePlan);
    formData.append("coursePlan", JSON.stringify(validCoursePlan));

    // Filter out empty coding problems and add to formData
    const validCodingProblems = codingProblems.filter(p => 
      p.title && 
      p.description && 
      p.testCases && 
      p.testCases.some(tc => tc.input && tc.expectedOutput)
    );
    console.log('UpdateCourse: Valid coding problems:', validCodingProblems);
    formData.append("codingProblems", JSON.stringify(validCodingProblems));

    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin?.token;
    if (!token) {
      toast.error("Please login to admin");
      navigate("/admin/login");
      return;
    }
    
    try {
      const response = await api.put(
        `/api/v1/course/update/${courseId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log('Update response:', response.data);
      toast.success(response.data.message || "Course updated successfully");
      setTimeout(() => {
        navigate("/admin/our-courses");
      }, 1000);
    } catch (error) {
      console.error('Update error:', error);
      const errorMsg = error.response?.data?.errors || error.response?.data?.error || error.message || "Error updating course";
      toast.error(errorMsg);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div>
      <div className="min-h-screen py-10">
        <div className="max-w-4xl mx-auto p-6 border rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-8">Update Course</h3>
          <form onSubmit={handleUpdateCourse} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-lg">Title</label>
              <input
                type="text"
                placeholder="Enter your course title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Description</label>
              <input
                type="text"
                placeholder="Enter your course description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Price</label>
              <input
                type="number"
                placeholder="Enter your course price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Course Image</label>
              <div className="flex items-center justify-center">
                <img
                  src={imagePreview ? `${imagePreview}` : "/placeholder.svg"}
                  alt="Course"
                  className="w-full max-w-sm h-auto rounded-md object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder.svg';
                  }}
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={changePhotoHandler}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
              />
            </div>

            {/* Course Materials Section */}
            <div className="space-y-2">
              <label className="block text-lg">Course Materials (Videos, PDFs, etc.)</label>
              {materials.length > 0 ? materials.map((material, index) => (
                <div key={index} className="flex gap-2 items-center mb-2 p-3 border border-gray-300 rounded-md">
                  <input
                    type="text"
                    placeholder="Material title (e.g., Lesson 1: Introduction)"
                    value={material.title}
                    onChange={(e) => handleMaterialChange(index, "title", e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-400 rounded-md outline-none"
                  />
                  <input
                    type="url"
                    placeholder="Material link (YouTube, Google Drive, etc.)"
                    value={material.link}
                    onChange={(e) => handleMaterialChange(index, "link", e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-400 rounded-md outline-none"
                  />
                  <select
                    value={material.type}
                    onChange={(e) => handleMaterialChange(index, "type", e.target.value)}
                    className="px-3 py-2 border border-gray-400 rounded-md outline-none"
                  >
                    <option value="video">Video</option>
                    <option value="pdf">PDF</option>
                    <option value="doc">Document</option>
                    <option value="other">Other</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRemoveMaterial(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              )) : (
                <p className="text-gray-500 text-sm">No materials added yet</p>
              )}
              <button
                type="button"
                onClick={handleAddMaterial}
                className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200"
              >
                + Add Material
              </button>
            </div>

            {/* Quiz Section */}
            <div className="space-y-2 border-t pt-6">
              <label className="block text-lg font-semibold">Course Quiz Questions</label>
              {quiz.length > 0 ? quiz.map((q, questionIndex) => (
                <div key={questionIndex} className="p-4 border border-gray-300 rounded-md bg-gray-50 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold">Question {q.questionNumber}</h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(questionIndex)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Enter question text"
                    value={q.question}
                    onChange={(e) => handleQuestionChange(questionIndex, "question", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none mb-2"
                  />

                  <div className="space-y-2 mb-2">
                    <label className="block text-sm font-semibold">Options:</label>
                    {q.options.map((option, optionIndex) => (
                      <input
                        key={optionIndex}
                        type="text"
                        placeholder={`Option ${optionIndex + 1}`}
                        value={option}
                        onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
                      />
                    ))}
                  </div>

                  <select
                    value={q.correctAnswer}
                    onChange={(e) => handleQuestionChange(questionIndex, "correctAnswer", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none mb-2"
                  >
                    <option value="">Select correct answer</option>
                    {q.options.map((option, idx) => (
                      <option key={idx} value={option}>{option || `Option ${idx + 1}`}</option>
                    ))}
                  </select>

                  <textarea
                    placeholder="Explanation (optional)"
                    value={q.explanation || ""}
                    onChange={(e) => handleQuestionChange(questionIndex, "explanation", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
                    rows="2"
                  />
                </div>
              )) : (
                <p className="text-gray-500 text-sm">No quiz questions added yet</p>
              )}
              <button
                type="button"
                onClick={handleAddQuestion}
                className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200"
              >
                + Add Question
              </button>
            </div>

            {/* Course Plan Section */}
            <div className="space-y-2 border-t pt-6">
              <label className="block text-lg font-semibold">Course Plan (Chapters & Topics)</label>
              {coursePlan.length > 0 ? coursePlan.map((plan, planIndex) => (
                <div key={planIndex} className="p-4 border border-gray-300 rounded-md bg-gray-50 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold">Chapter {plan.chapter}</h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveCoursePlan(planIndex)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Chapter title"
                    value={plan.title}
                    onChange={(e) => handleCoursePlanChange(planIndex, "title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none mb-2"
                  />

                  <textarea
                    placeholder="Chapter description"
                    value={plan.description}
                    onChange={(e) => handleCoursePlanChange(planIndex, "description", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none mb-2"
                    rows="2"
                  />

                  <input
                    type="text"
                    placeholder="Duration (e.g., 2 hours)"
                    value={plan.duration}
                    onChange={(e) => handleCoursePlanChange(planIndex, "duration", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none mb-2"
                  />

                  <div className="space-y-2 mb-2">
                    <label className="block text-sm font-semibold">Topics:</label>
                    {plan.topics && plan.topics.map((topic, topicIndex) => (
                      <div key={topicIndex} className="flex gap-2">
                        <input
                          type="text"
                          placeholder={`Topic ${topicIndex + 1}`}
                          value={topic}
                          onChange={(e) => handleTopicChange(planIndex, topicIndex, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-400 rounded-md outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveTopic(planIndex, topicIndex)}
                          className="px-2 py-2 bg-red-400 text-white rounded text-sm hover:bg-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddTopic(planIndex)}
                      className="py-1 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
                    >
                      + Add Topic
                    </button>
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 text-sm">No course plan added yet</p>
              )}
              <button
                type="button"
                onClick={handleAddCoursePlan}
                className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200"
              >
                + Add Chapter
              </button>
            </div>

            {/* Coding Problems Section */}
            <div className="space-y-2 border-t pt-6">
              <label className="block text-lg font-semibold text-purple-700">
                Coding Problems (Optional)
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Add coding challenges for students to solve during the quiz
              </p>
              
              {codingProblems.length > 0 ? codingProblems.map((problem, problemIndex) => (
                <div key={problemIndex} className="p-4 border-2 border-purple-300 rounded-md bg-purple-50 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-purple-800">
                      Coding Problem {problem.problemNumber}
                    </h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveCodingProblem(problemIndex)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Problem Title */}
                  <input
                    type="text"
                    placeholder="Problem title (e.g., 'Two Sum' or 'Reverse String')"
                    value={problem.title}
                    onChange={(e) => handleCodingProblemChange(problemIndex, "title", e.target.value)}
                    className="w-full px-3 py-2 border border-purple-400 rounded-md outline-none mb-2 font-semibold"
                  />

                  {/* Problem Description */}
                  <textarea
                    placeholder="Describe the problem. Include constraints, examples, and requirements."
                    value={problem.description}
                    onChange={(e) => handleCodingProblemChange(problemIndex, "description", e.target.value)}
                    className="w-full px-3 py-2 border border-purple-400 rounded-md outline-none mb-2"
                    rows="4"
                  />

                  {/* Difficulty */}
                  <div className="mb-2">
                    <label className="block text-sm font-semibold mb-1">Difficulty:</label>
                    <select
                      value={problem.difficulty}
                      onChange={(e) => handleCodingProblemChange(problemIndex, "difficulty", e.target.value)}
                      className="w-full px-3 py-2 border border-purple-400 rounded-md outline-none"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  {/* Starter Code */}
                  <div className="mb-2">
                    <label className="block text-sm font-semibold mb-1">
                      Starter Code (Optional):
                    </label>
                    <textarea
                      placeholder="function solution() {&#10;  // Write your code here&#10;}"
                      value={problem.starterCode}
                      onChange={(e) => handleCodingProblemChange(problemIndex, "starterCode", e.target.value)}
                      className="w-full px-3 py-2 border border-purple-400 rounded-md outline-none font-mono text-sm bg-gray-900 text-green-400"
                      rows="4"
                    />
                  </div>

                  {/* Test Cases */}
                  <div className="mb-2 p-3 bg-blue-50 rounded-md">
                    <label className="block text-sm font-semibold mb-2">Test Cases:</label>
                    {problem.testCases && problem.testCases.map((testCase, testCaseIndex) => (
                      <div key={testCaseIndex} className="flex gap-2 mb-2 bg-white p-2 rounded">
                        <input
                          type="text"
                          placeholder="Input (e.g., [2,7,11,15], 9)"
                          value={testCase.input}
                          onChange={(e) => handleTestCaseChange(problemIndex, testCaseIndex, "input", e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-400 rounded-md outline-none text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Expected Output (e.g., [0,1])"
                          value={testCase.expectedOutput}
                          onChange={(e) => handleTestCaseChange(problemIndex, testCaseIndex, "expectedOutput", e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-400 rounded-md outline-none text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveTestCase(problemIndex, testCaseIndex)}
                          className="px-2 py-2 bg-red-400 text-white rounded text-sm hover:bg-red-500"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddTestCase(problemIndex)}
                      className="py-1 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
                    >
                      + Add Test Case
                    </button>
                  </div>

                  {/* Hints */}
                  <div className="p-3 bg-yellow-50 rounded-md">
                    <label className="block text-sm font-semibold mb-2">Hints (Optional):</label>
                    {problem.hints && problem.hints.map((hint, hintIndex) => (
                      <div key={hintIndex} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder={`Hint ${hintIndex + 1}`}
                          value={hint}
                          onChange={(e) => handleHintChange(problemIndex, hintIndex, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-400 rounded-md outline-none text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveHint(problemIndex, hintIndex)}
                          className="px-2 py-2 bg-red-400 text-white rounded text-sm hover:bg-red-500"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddHint(problemIndex)}
                      className="py-1 px-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm"
                    >
                      + Add Hint
                    </button>
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 text-sm">No coding problems added yet</p>
              )}
              <button
                type="button"
                onClick={handleAddCodingProblem}
                className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors duration-200"
              >
                + Add Coding Problem
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
            >
              Update Course
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateCourse;
