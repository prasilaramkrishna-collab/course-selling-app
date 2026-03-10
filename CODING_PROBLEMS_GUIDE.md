# How to Add Coding Problems to Your Course

## 📝 Overview

Coding problems allow students to practice programming challenges directly in your course quiz. This guide shows you how to add coding problems through the admin panel.

---

## 🎯 Step-by-Step Guide

### 1. **Navigate to Course Update Page**
   - Go to Admin Dashboard at `/admin/our-courses`
   - Find the course where you want to add coding problems
   - Click the "Update" button

### 2. **Find the Coding Problems Section**
   - Scroll down past the Quiz Questions and Course Plan sections
   - You'll see a purple section titled **"Coding Problems (Optional)"**
   - Click the **"+ Add Coding Problem"** button

### 3. **Fill in Problem Details**

For each coding problem, you need to provide:

#### **a) Problem Title**
   - Short, descriptive name for the problem
   - Example: "Two Sum", "Reverse String", "Find Maximum"

#### **b) Problem Description**
   - Detailed explanation of what the student needs to solve
   - Include:
     - Problem statement
     - Input/output format
     - Constraints
     - Example cases
   
   **Example:**
   ```
   Write a function that takes an array of integers and a target sum.
   Return the indices of two numbers that add up to the target.
   
   Constraints:
   - Each input has exactly one solution
   - You cannot use the same element twice
   
   Example:
   Input: [2, 7, 11, 15], target = 9
   Output: [0, 1]
   Explanation: nums[0] + nums[1] = 2 + 7 = 9
   ```

#### **c) Difficulty Level**
   - Select from dropdown: Easy, Medium, or Hard
   - This will be displayed to students

#### **d) Starter Code (Optional)**
   - Pre-filled code template for students
   - Helps them get started quickly
   
   **Example:**
   ```javascript
   function twoSum(nums, target) {
     // Write your solution here
     
   }
   ```

#### **e) Test Cases (Required)**
   - Add at least 2-3 test cases
   - Each test case has:
     - **Input**: The input data (e.g., `[2,7,11,15], 9`)
     - **Expected Output**: What the correct answer should be (e.g., `[0,1]`)
   
   - Click **"+ Add Test Case"** to add more test cases
   - Students will see these to verify their solution

#### **f) Hints (Optional)**
   - Add helpful hints to guide students
   - Each hint should progressively reveal more of the solution
   
   **Example Hints:**
   ```
   Hint 1: Consider using a hash map to store values you've seen
   Hint 2: For each number, check if (target - number) exists in the hash map
   Hint 3: Remember to return the indices, not the values
   ```

### 4. **Add Multiple Coding Problems**
   - Click **"+ Add Coding Problem"** again to add more problems
   - Each problem is numbered automatically (Problem 1, 2, 3...)

### 5. **Remove Coding Problems**
   - Click the red **"Remove"** button on any problem to delete it
   - Remaining problems will be automatically renumbered

### 6. **Save Your Changes**
   - Scroll to the bottom of the form
   - Click **"Update Course"** to save all changes
   - Your coding problems are now part of the course quiz!

---

## 🎓 How Students See Coding Problems

When students take the quiz:

1. **Timer Display**: They see a countdown timer at the top
2. **View Button**: A button labeled "View Coding Problem" appears if problems exist
3. **Problem Interface**: When they click it, they see:
   - Problem title and difficulty badge
   - Full problem description
   - Code editor (dark theme) to write their solution
   - Test cases to verify their work
   - Hints they can reference
4. **Toggle Back**: They can switch between quiz questions and coding problems

---

## ✅ Best Practices

### Clear Problem Descriptions
- Be specific about input/output formats
- Include edge cases in your description
- Provide at least one example

### Comprehensive Test Cases
- Cover normal cases
- Include edge cases (empty arrays, single elements, etc.)
- Add boundary conditions
- Minimum 2-3 test cases per problem

### Useful Starter Code
- Provide function signature
- Include helpful comments
- Don't give away the solution

### Progressive Hints
- Start with general approach hints
- Middle hints can mention specific data structures
- Final hints can be more detailed
- Don't reveal the complete solution

### Difficulty Levels
- **Easy**: Basic algorithms, single concepts
- **Medium**: Multiple steps, common patterns
- **Hard**: Complex algorithms, optimization needed

---

## 💡 Example: Complete Coding Problem

```
Title: Find the Missing Number

Description:
Given an array containing n distinct numbers from 0 to n, find the missing number.
The array will have n elements from the set [0, 1, 2, ..., n].

Example 1:
Input: [3, 0, 1]
Output: 2

Example 2:
Input: [0, 1]
Output: 2

Constraints:
- 1 <= n <= 10^4
- All numbers are unique

Difficulty: Easy

Starter Code:
function findMissingNumber(nums) {
  // Write your solution here
  
}

Test Cases:
1. Input: [3, 0, 1]     → Expected: 2
2. Input: [0, 1]        → Expected: 2
3. Input: [9,6,4,2,3,5,7,0,1] → Expected: 8

Hints:
1. Think about the mathematical formula for the sum of first n natural numbers
2. Calculate what the sum should be, then subtract the actual sum
3. Formula: sum = n * (n + 1) / 2
```

---

## 🔍 Verification Checklist

Before publishing your coding problem:

- [ ] Title is clear and concise
- [ ] Description includes examples and constraints
- [ ] Difficulty level is set appropriately
- [ ] At least 2 test cases are added
- [ ] Test cases cover normal and edge cases
- [ ] Starter code (if provided) is correct
- [ ] Hints are progressive and helpful
- [ ] Problem is saved (clicked "Update Course")

---

## 🛠️ Troubleshooting

### Coding Problems Not Showing?
- Make sure you clicked "Update Course" to save
- Verify at least one test case has valid input and output
- Check that the problem has a title and description

### Students Can't See Problems?
- Ensure the course has at least one coding problem
- Verify students are enrolled in the course
- Test by taking the quiz yourself

### Test Cases Not Displaying?
- Each test case must have both input and output
- Remove any empty test cases before saving

---

## 📚 Tips for Different Course Types

### **Programming Courses (JavaScript, Python, etc.)**
- Add 2-4 coding problems per course
- Mix difficulties: 1 Easy, 2 Medium, 1 Hard
- Focus on course-specific concepts

### **Data Structures & Algorithms**
- 3-5 problems recommended
- Each problem should test a different concept
- Include time/space complexity in descriptions

### **Web Development**
- 1-2 practical coding challenges
- Focus on DOM manipulation or API usage
- Provide realistic scenarios

---

## 🎉 You're Ready!

Now you can create engaging coding challenges for your students. Students will see the coding problems when they take the quiz and can practice their skills directly in the platform.

**Need Help?** Check the quiz taking interface to see how your problems appear to students.
