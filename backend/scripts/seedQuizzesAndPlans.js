import mongoose from "mongoose";
import { Course } from "../models/course.model.js";
import dotenv from "dotenv";

dotenv.config();

const codingQuizBanks = {
  javascript: [
    {
      question: "What will `typeof null` return in JavaScript?",
      options: ["object", "null", "undefined", "number"],
      correctAnswer: "object",
      explanation: "This is a historical quirk in JavaScript; `typeof null` returns `object`."
    },
    {
      question: "Which array method should you use to transform each element and return a new array?",
      options: ["forEach", "filter", "map", "reduceRight"],
      correctAnswer: "map",
      explanation: "`map` is designed for 1-to-1 transformations into a new array."
    },
    {
      question: "What does `Promise.all()` do when one promise rejects?",
      options: [
        "It waits for all promises and returns partial results",
        "It resolves with successful promises only",
        "It rejects immediately with that rejection",
        "It retries rejected promises automatically"
      ],
      correctAnswer: "It rejects immediately with that rejection",
      explanation: "`Promise.all` fails fast on the first rejection."
    },
    {
      question: "Which keyword creates a block-scoped variable that cannot be reassigned?",
      options: ["var", "let", "const", "final"],
      correctAnswer: "const",
      explanation: "`const` declares a block-scoped binding that cannot be reassigned."
    },
    {
      question: "Given `const x = [1,2,3];`, which code returns `[2,4,6]`?",
      options: [
        "x.forEach(n => n * 2)",
        "x.map(n => n * 2)",
        "x.filter(n => n * 2)",
        "x.reduce((a, n) => a + n * 2, [])"
      ],
      correctAnswer: "x.map(n => n * 2)",
      explanation: "`map` returns a new array with transformed values."
    },
    {
      question: "What is the output of `Boolean('0')`?",
      options: ["false", "0", "true", "undefined"],
      correctAnswer: "true",
      explanation: "Any non-empty string in JavaScript is truthy."
    },
    {
      question: "Which pattern helps prevent callback nesting in async JavaScript?",
      options: ["Global variables", "Promise chaining / async-await", "Using while loops", "Switch statements"],
      correctAnswer: "Promise chaining / async-await",
      explanation: "Promises and async-await flatten asynchronous flow and improve readability."
    },
    {
      question: "What does event delegation primarily optimize?",
      options: [
        "Database indexing",
        "Memory usage and listener management",
        "Network bandwidth",
        "Image compression"
      ],
      correctAnswer: "Memory usage and listener management",
      explanation: "Event delegation uses fewer listeners by handling events higher in the DOM tree."
    },
    {
      question: "What is the result of `2 + '2'` in JavaScript?",
      options: ["4", "22", "NaN", "Error"],
      correctAnswer: "22",
      explanation: "When one operand is a string, JavaScript concatenates values as strings."
    },
    {
      question: "Which loop is commonly used to iterate over array values directly?",
      options: ["for...of", "for...in", "while(true)", "do...unless"],
      correctAnswer: "for...of",
      explanation: "`for...of` iterates over iterable values such as array elements."
    }
  ],
  react: [
    {
      question: "In React, what is the main reason to use a `key` prop in lists?",
      options: [
        "To style each element differently",
        "To help React identify changed items efficiently",
        "To send data to the backend",
        "To avoid writing `map()`"
      ],
      correctAnswer: "To help React identify changed items efficiently",
      explanation: "Keys allow React reconciliation to track item identity between renders."
    },
    {
      question: "Which hook should you use to store a value that persists across renders but does not trigger re-renders?",
      options: ["useState", "useEffect", "useRef", "useMemo"],
      correctAnswer: "useRef",
      explanation: "`useRef` stores mutable values without causing re-renders when changed."
    },
    {
      question: "What is the best place to fetch data in a function component?",
      options: ["Inside JSX", "Inside `useEffect`", "Inside CSS", "Inside `return` statement only"],
      correctAnswer: "Inside `useEffect`",
      explanation: "Data fetching is a side effect and belongs in `useEffect`."
    },
    {
      question: "If state update depends on previous state, which pattern is safest?",
      options: [
        "setCount(count + 1)",
        "setCount(prev => prev + 1)",
        "count = count + 1",
        "setCount(++count)"
      ],
      correctAnswer: "setCount(prev => prev + 1)",
      explanation: "Functional updates avoid stale state issues in async rendering."
    },
    {
      question: "What does lifting state up solve?",
      options: [
        "Reducing bundle size",
        "Sharing state between sibling components",
        "Improving CSS performance",
        "Avoiding component props"
      ],
      correctAnswer: "Sharing state between sibling components",
      explanation: "Moving state to a common parent allows multiple children to coordinate via props."
    },
    {
      question: "Which hook memoizes expensive calculations?",
      options: ["useMemo", "useLayoutEffect", "useRef", "useContext"],
      correctAnswer: "useMemo",
      explanation: "`useMemo` caches computed values until dependencies change."
    },
    {
      question: "A component re-renders too often due to inline callbacks. What is a common optimization?",
      options: ["useCallback", "useDebugValue", "useId", "useImperativeHandle"],
      correctAnswer: "useCallback",
      explanation: "`useCallback` memoizes callback references to reduce unnecessary child renders."
    },
    {
      question: "What should you return from `useEffect` when setting up subscriptions or timers?",
      options: ["Nothing ever", "A cleanup function", "A JSX element", "A Promise"],
      correctAnswer: "A cleanup function",
      explanation: "Cleanup prevents memory leaks when components unmount or dependencies change."
    },
    {
      question: "How is data typically passed from a parent component to a child component in React?",
      options: ["Through props", "Through CSS", "Through localStorage only", "Through npm scripts"],
      correctAnswer: "Through props",
      explanation: "Props are the standard way to pass data from parent to child components."
    },
    {
      question: "Which file extension is commonly used for React components with JSX?",
      options: [".jsx", ".sql", ".exe", ".txt"],
      correctAnswer: ".jsx",
      explanation: "JSX syntax is commonly written in `.jsx` files (or `.tsx` with TypeScript)."
    }
  ],
  webdevelopment: [
    {
      question: "Which HTTP status code usually indicates a successful resource creation?",
      options: ["200", "201", "301", "404"],
      correctAnswer: "201",
      explanation: "`201 Created` is the standard response for successful resource creation."
    },
    {
      question: "Why is semantic HTML important?",
      options: [
        "It makes JavaScript optional",
        "It improves accessibility and SEO",
        "It replaces CSS",
        "It speeds up backend APIs"
      ],
      correctAnswer: "It improves accessibility and SEO",
      explanation: "Semantic tags give structure and meaning for screen readers and search engines."
    },
    {
      question: "What is the main purpose of CORS headers?",
      options: [
        "Compress images",
        "Control cross-origin resource access",
        "Cache JavaScript",
        "Validate HTML forms"
      ],
      correctAnswer: "Control cross-origin resource access",
      explanation: "CORS defines which origins may access server resources in browsers."
    },
    {
      question: "Which CSS layout tool is ideal for one-dimensional alignment?",
      options: ["Grid", "Flexbox", "Float", "Table"],
      correctAnswer: "Flexbox",
      explanation: "Flexbox excels at one-dimensional row or column layouts."
    },
    {
      question: "What is a progressive enhancement strategy?",
      options: [
        "Build for modern browsers only",
        "Start with core functionality, then layer advanced features",
        "Use only JavaScript frameworks",
        "Avoid responsive design"
      ],
      correctAnswer: "Start with core functionality, then layer advanced features",
      explanation: "Progressive enhancement ensures baseline usability across environments."
    },
    {
      question: "Which practice best reduces Largest Contentful Paint (LCP)?",
      options: [
        "Blocking CSS loading",
        "Optimizing and preloading hero assets",
        "Adding more web fonts",
        "Rendering everything client-side only"
      ],
      correctAnswer: "Optimizing and preloading hero assets",
      explanation: "LCP improves when key visible content loads quickly."
    },
    {
      question: "In RESTful APIs, which method is commonly used for partial updates?",
      options: ["POST", "GET", "PATCH", "DELETE"],
      correctAnswer: "PATCH",
      explanation: "`PATCH` is intended for partial resource modifications."
    },
    {
      question: "What is the most secure place to validate user input?",
      options: ["Only frontend", "Only browser extensions", "Backend (server-side)", "Only HTML attributes"],
      correctAnswer: "Backend (server-side)",
      explanation: "Client validation improves UX, but server validation is required for security."
    },
    {
      question: "Which HTML tag is used to create a hyperlink?",
      options: ["<a>", "<link>", "<p>", "<img>"],
      correctAnswer: "<a>",
      explanation: "The anchor tag `<a>` is used to create clickable links."
    },
    {
      question: "What does CSS stand for?",
      options: ["Cascading Style Sheets", "Computer Style Syntax", "Creative Sheet System", "Code Styling Script"],
      correctAnswer: "Cascading Style Sheets",
      explanation: "CSS controls presentation and layout of web pages."
    }
  ],
  python: [
    {
      question: "What is the output of `len({'a': 1, 'b': 2})` in Python?",
      options: ["1", "2", "3", "Error"],
      correctAnswer: "2",
      explanation: "Dictionary length equals the number of keys."
    },
    {
      question: "Which structure provides O(1) average lookup by key?",
      options: ["list", "tuple", "dict", "set"],
      correctAnswer: "dict",
      explanation: "Python dictionaries are hash maps with average O(1) key lookup."
    },
    {
      question: "What does list comprehension `[x*x for x in range(3)]` produce?",
      options: ["[1, 4, 9]", "[0, 1, 4]", "[0, 1, 2]", "[1, 2, 3]"],
      correctAnswer: "[0, 1, 4]",
      explanation: "range(3) yields 0,1,2 and each value is squared."
    },
    {
      question: "Which keyword is used to handle exceptions?",
      options: ["catch", "try/except", "handle", "guard"],
      correctAnswer: "try/except",
      explanation: "Python uses `try` and `except` blocks for exception handling."
    },
    {
      question: "What is the most Pythonic way to iterate index and value together?",
      options: ["for i in range(len(a))", "for i,v in enumerate(a)", "for v in a.keys()", "for i,v in zip(a,a)"],
      correctAnswer: "for i,v in enumerate(a)",
      explanation: "`enumerate` yields both index and element cleanly."
    },
    {
      question: "What does `if __name__ == '__main__':` guard control?",
      options: ["Package installation", "Code executed only when run directly", "Thread safety", "Memory allocation"],
      correctAnswer: "Code executed only when run directly",
      explanation: "It prevents script code from running on import."
    },
    {
      question: "Which data type is immutable?",
      options: ["list", "dict", "set", "tuple"],
      correctAnswer: "tuple",
      explanation: "Tuples are immutable sequences."
    },
    {
      question: "For asynchronous I/O in modern Python, which syntax is used?",
      options: ["sync/wait", "await/async", "thread/run", "parallel/lock"],
      correctAnswer: "await/async",
      explanation: "`async def` and `await` are used with asyncio for async I/O."
    },
    {
      question: "What is printed by `print(10 // 3)` in Python?",
      options: ["3", "3.33", "1", "Error"],
      correctAnswer: "3",
      explanation: "`//` performs floor division and returns the integer part."
    },
    {
      question: "Which keyword defines a function in Python?",
      options: ["func", "define", "def", "function"],
      correctAnswer: "def",
      explanation: "Python functions are declared using the `def` keyword."
    }
  ],
  java: [
    {
      question: "What is the correct way to declare the main method in Java?",
      options: [
        "public static void main(String[] args)",
        "static public main(String args[])",
        "void main()",
        "function main(args)"
      ],
      correctAnswer: "public static void main(String[] args)",
      explanation: "This is the standard signature for the entry point of a Java application."
    },
    {
      question: "Which keyword is used to create a subclass in Java?",
      options: ["inherits", "extends", "implements", "derives"],
      correctAnswer: "extends",
      explanation: "`extends` is used for class inheritance in Java."
    },
    {
      question: "What is the result of `5 / 2` in Java (with int operands)?",
      options: ["2.5", "2", "3", "Error"],
      correctAnswer: "2",
      explanation: "Integer division truncates the decimal part, yielding 2."
    },
    {
      question: "Which access modifier makes a member accessible only within its own class?",
      options: ["public", "protected", "private", "default"],
      correctAnswer: "private",
      explanation: "`private` restricts access to the declaring class only."
    },
    {
      question: "What does JVM stand for?",
      options: ["Java Variable Machine", "Java Virtual Machine", "Just Verify Memory", "Java Variant Mode"],
      correctAnswer: "Java Virtual Machine",
      explanation: "JVM executes Java bytecode on any platform."
    },
    {
      question: "Which loop guarantees at least one execution?",
      options: ["for", "while", "do-while", "foreach"],
      correctAnswer: "do-while",
      explanation: "`do-while` checks the condition after executing the body."
    },
    {
      question: "How do you create a constant variable in Java?",
      options: ["const int x = 5;", "final int x = 5;", "static int x = 5;", "readonly int x = 5;"],
      correctAnswer: "final int x = 5;",
      explanation: "`final` keyword prevents reassignment of variables."
    },
    {
      question: "What is the output of `System.out.println(10 + 20 + \"30\")`?",
      options: ["102030", "3030", "60", "Error"],
      correctAnswer: "3030",
      explanation: "Left-to-right evaluation: 10+20=30, then 30+\"30\" concatenates to \"3030\"."
    }
  ],
  cpp: [
    {
      question: "Which symbol is used to access a member via a pointer in C++?",
      options: [".", "->", "::", "*"],
      correctAnswer: "->",
      explanation: "The arrow operator `->` dereferences a pointer and accesses its member."
    },
    {
      question: "What does `cout` stand for in C++?",
      options: ["Console output", "Character out", "Compiler output", "Count output"],
      correctAnswer: "Console output",
      explanation: "`cout` is the standard output stream in C++."
    },
    {
      question: "Which header file is needed to use `cout` and `cin`?",
      options: ["<stdio.h>", "<iostream>", "<string.h>", "<vector>"],
      correctAnswer: "<iostream>",
      explanation: "`<iostream>` provides input/output stream objects like `cout` and `cin`."
    },
    {
      question: "What is the correct way to declare a reference variable?",
      options: ["int& ref = x;", "int ref& = x;", "ref int = x;", "int *ref = x;"],
      correctAnswer: "int& ref = x;",
      explanation: "References are declared with `&` after the type."
    },
    {
      question: "Which operator is used for dynamic memory allocation in C++?",
      options: ["malloc", "alloc", "new", "create"],
      correctAnswer: "new",
      explanation: "`new` allocates memory on the heap and returns a pointer."
    },
    {
      question: "What does the `virtual` keyword enable in C++?",
      options: ["Static binding", "Dynamic (runtime) polymorphism", "Memory optimization", "Thread safety"],
      correctAnswer: "Dynamic (runtime) polymorphism",
      explanation: "`virtual` allows derived classes to override base class methods."
    },
    {
      question: "Which loop is entry-controlled in C++?",
      options: ["do-while", "while", "foreach", "repeat-until"],
      correctAnswer: "while",
      explanation: "`while` checks the condition before entering the loop body."
    },
    {
      question: "What is the result of `5 % 2` in C++?",
      options: ["2.5", "2", "1", "0"],
      correctAnswer: "1",
      explanation: "The modulus operator `%` returns the remainder of division."
    }
  ],
  csharp: [
    {
      question: "What is the keyword to declare a constant in C#?",
      options: ["final", "const", "readonly", "static"],
      correctAnswer: "const",
      explanation: "`const` declares compile-time constants in C#."
    },
    {
      question: "Which method is the entry point of a C# console application?",
      options: ["Start()", "Main()", "Begin()", "Run()"],
      correctAnswer: "Main()",
      explanation: "`Main()` is the entry point method for C# applications."
    },
    {
      question: "What does the `var` keyword do in C#?",
      options: [
        "Creates a variable-length array",
        "Uses implicit typing (compiler infers type)",
        "Declares a mutable reference",
        "Prevents assignment"
      ],
      correctAnswer: "Uses implicit typing (compiler infers type)",
      explanation: "`var` allows the compiler to infer the type from the initializer."
    },
    {
      question: "Which collection type in C# is ordered and allows duplicates?",
      options: ["HashSet", "Dictionary", "List", "Queue"],
      correctAnswer: "List",
      explanation: "`List<T>` maintains insertion order and permits duplicate elements."
    },
    {
      question: "What does LINQ stand for?",
      options: [
        "Language Integrated Query",
        "Linear Query",
        "Linked Integration Query",
        "List Index Query"
      ],
      correctAnswer: "Language Integrated Query",
      explanation: "LINQ provides query capabilities directly in C# syntax."
    },
    {
      question: "Which keyword is used to handle exceptions in C#?",
      options: ["catch", "except", "trap", "handle"],
      correctAnswer: "catch",
      explanation: "C# uses `try-catch-finally` blocks for exception handling."
    },
    {
      question: "What is the base class of all classes in C#?",
      options: ["System.Base", "System.Object", "System.Class", "System.Root"],
      correctAnswer: "System.Object",
      explanation: "All C# types implicitly inherit from `System.Object`."
    },
    {
      question: "What is the correct way to create a nullable int in C#?",
      options: ["int? x;", "nullable int x;", "int x = null;", "int* x;"],
      correctAnswer: "int? x;",
      explanation: "The `?` suffix makes value types nullable."
    }
  ]
};

const nonCodingQuizBanks = {
  powerbi: [
    {
      question: "A sales dashboard must compare this month vs last month. Which DAX pattern is most suitable?",
      options: ["Time intelligence with DATEADD", "Static calculated column only", "Manual Excel copy-paste", "Random sampling"],
      correctAnswer: "Time intelligence with DATEADD",
      explanation: "Time intelligence functions are designed for period-over-period analysis."
    },
    {
      question: "What is the best reason to create a star schema before building visuals?",
      options: ["More colors in charts", "Cleaner relationships and faster analysis", "No need for measures", "Avoids data refresh"],
      correctAnswer: "Cleaner relationships and faster analysis",
      explanation: "A star schema improves model clarity and report performance."
    },
    {
      question: "Which visual is best to show progress toward a target KPI?",
      options: ["Gauge or KPI visual", "Scatter chart", "Treemap only", "Slicer"],
      correctAnswer: "Gauge or KPI visual",
      explanation: "KPI and gauge visuals clearly communicate goal progress."
    },
    {
      question: "When refresh time is slow, what should you check first?",
      options: ["Color palette", "Query transformations and source performance", "Tooltip text", "Dashboard title"],
      correctAnswer: "Query transformations and source performance",
      explanation: "Slow refresh is usually tied to data source latency and heavy transformation steps."
    },
    {
      question: "What is row-level security (RLS) used for?",
      options: ["Animating charts", "Restricting data access by user role", "Increasing data model size", "Changing report themes"],
      correctAnswer: "Restricting data access by user role",
      explanation: "RLS controls who can see which rows of data."
    },
    {
      question: "A stakeholder needs mobile-friendly reports. What is the right step?",
      options: ["Use phone layout optimization", "Disable visuals", "Export to CSV only", "Increase page width endlessly"],
      correctAnswer: "Use phone layout optimization",
      explanation: "Power BI offers phone layouts tailored for small screens."
    }
  ],
  digitalmarketing: [
    {
      question: "Which metric best measures ad creative effectiveness in awareness campaigns?",
      options: ["CTR with engagement trend", "Server CPU usage", "Refund ratio only", "SSL certificate age"],
      correctAnswer: "CTR with engagement trend",
      explanation: "CTR and engagement patterns show how well creatives attract audience attention."
    },
    {
      question: "A landing page has high traffic but low conversions. What should be tested first?",
      options: ["CTA copy and form friction", "Logo color only", "DNS provider", "Office Wi-Fi speed"],
      correctAnswer: "CTA copy and form friction",
      explanation: "Message clarity and friction in the conversion path are frequent bottlenecks."
    },
    {
      question: "What is the goal of audience segmentation?",
      options: ["Show one ad to everyone", "Deliver personalized messaging by user traits", "Reduce website uptime", "Disable analytics"],
      correctAnswer: "Deliver personalized messaging by user traits",
      explanation: "Segmentation improves relevance and campaign performance."
    },
    {
      question: "Which channel is typically strongest for high-intent purchase traffic?",
      options: ["Search ads", "Display retargeting only", "Podcast intro music", "Brand slogan length"],
      correctAnswer: "Search ads",
      explanation: "Search captures users actively looking for solutions."
    },
    {
      question: "What does A/B testing help validate?",
      options: ["Hypothesis about conversion impact", "Whether JavaScript is enabled", "Database backups", "Office chair quality"],
      correctAnswer: "Hypothesis about conversion impact",
      explanation: "A/B testing compares variants to prove measurable impact."
    },
    {
      question: "Which retention tactic usually increases lifetime value?",
      options: ["Lifecycle email campaigns", "Removing onboarding", "Ignoring churn signals", "Publishing fewer updates"],
      correctAnswer: "Lifecycle email campaigns",
      explanation: "Lifecycle messaging improves engagement and repeat conversion."
    }
  ]
};

const codingProblemsBank = {
  javascript: {
    title: "Find Maximum Number in Array",
    description: "Write a function that takes an array of numbers and returns the maximum number. Do not use Math.max().",
    starterCode: "function findMax(arr) {\n  // Your code here\n  \n}",
    testCases: [
      { input: "[1, 5, 3, 9, 2]", expectedOutput: "9" },
      { input: "[10]", expectedOutput: "10" },
      { input: "[-5, -2, -10, -1]", expectedOutput: "-1" }
    ],
    difficulty: "Easy",
    hints: ["Use a variable to track the current maximum", "Loop through the array comparing each element"]
  },
  react: {
    title: "Create a Counter Component",
    description: "Create a React functional component that displays a count and has increment/decrement buttons.",
    starterCode: "function Counter() {\n  // Your code here\n  \n  return (\n    <div>\n      {/* Add your JSX here */}\n    </div>\n  );\n}",
    testCases: [
      { input: "Initial render", expectedOutput: "Count starts at 0" },
      { input: "Click increment", expectedOutput: "Count increases by 1" },
      { input: "Click decrement", expectedOutput: "Count decreases by 1" }
    ],
    difficulty: "Easy",
    hints: ["Use useState hook for state management", "Add onClick handlers to buttons"]
  },
  python: {
    title: "Check if String is Palindrome",
    description: "Write a function that checks if a given string is a palindrome (reads the same forwards and backwards). Ignore spaces and case.",
    starterCode: "def is_palindrome(s):\n    # Your code here\n    pass",
    testCases: [
      { input: "\"racecar\"", expectedOutput: "True" },
      { input: "\"A man a plan a canal Panama\"", expectedOutput: "True" },
      { input: "\"hello\"", expectedOutput: "False" }
    ],
    difficulty: "Easy",
    hints: ["Remove spaces and convert to lowercase first", "Compare string with its reverse"]
  },
  java: {
    title: "Sum of Even Numbers",
    description: "Write a method that returns the sum of all even numbers from 1 to n (inclusive).",
    starterCode: "public class Solution {\n    public int sumEvenNumbers(int n) {\n        // Your code here\n        \n    }\n}",
    testCases: [
      { input: "10", expectedOutput: "30" },
      { input: "5", expectedOutput: "6" },
      { input: "1", expectedOutput: "0" }
    ],
    difficulty: "Easy",
    hints: ["Use a loop from 1 to n", "Check if number is even using modulo operator %"]
  },
  cpp: {
    title: "Reverse an Array",
    description: "Write a function that reverses an array in-place without using extra space.",
    starterCode: "#include <vector>\nusing namespace std;\n\nvoid reverseArray(vector<int>& arr) {\n    // Your code here\n    \n}",
    testCases: [
      { input: "[1, 2, 3, 4, 5]", expectedOutput: "[5, 4, 3, 2, 1]" },
      { input: "[10, 20]", expectedOutput: "[20, 10]" },
      { input: "[7]", expectedOutput: "[7]" }
    ],
    difficulty: "Easy",
    hints: ["Use two pointers: one at start, one at end", "Swap elements and move pointers towards center"]
  },
  csharp: {
    title: "Find Factorial",
    description: "Write a method that calculates the factorial of a non-negative integer n. Factorial of n (n!) is the product of all positive integers less than or equal to n.",
    starterCode: "public class Solution {\n    public long Factorial(int n) {\n        // Your code here\n        \n    }\n}",
    testCases: [
      { input: "5", expectedOutput: "120" },
      { input: "0", expectedOutput: "1" },
      { input: "3", expectedOutput: "6" }
    ],
    difficulty: "Easy",
    hints: ["Base case: factorial of 0 is 1", "Use a loop or recursion to multiply numbers"]
  },
  webdevelopment: {
    title: "Validate Email Format",
    description: "Write a function that validates if a string is a properly formatted email address (has @ and domain).",
    starterCode: "function isValidEmail(email) {\n  // Your code here\n  \n}",
    testCases: [
      { input: "\"user@example.com\"", expectedOutput: "true" },
      { input: "\"invalid.email\"", expectedOutput: "false" },
      { input: "\"test@domain.co.in\"", expectedOutput: "true" }
    ],
    difficulty: "Easy",
    hints: ["Check if '@' exists in the string", "Verify there's text before and after @", "Check for a dot in the domain part"]
  },
  generic: {
    title: "FizzBuzz Problem",
    description: "Write a function that prints numbers from 1 to n. For multiples of 3 print 'Fizz', for multiples of 5 print 'Buzz', and for multiples of both print 'FizzBuzz'.",
    starterCode: "function fizzBuzz(n) {\n  // Your code here\n  \n}",
    testCases: [
      { input: "15", expectedOutput: "Prints 1,2,Fizz,4,Buzz,...,FizzBuzz" },
      { input: "5", expectedOutput: "Prints 1,2,Fizz,4,Buzz" },
      { input: "3", expectedOutput: "Prints 1,2,Fizz" }
    ],
    difficulty: "Easy",
    hints: ["Check divisibility by 15 first (both 3 and 5)", "Then check for 3, then 5", "Use modulo operator %"]
  }
};

const codingCourseKeywords = [
  "javascript",
  "react",
  "node",
  "web development",
  "frontend",
  "backend",
  "full stack",
  "python",
  "java",
  "c++",
  "c#",
  "typescript",
  "programming",
  "coding"
];

const codingBankMap = {
  javascript: ["javascript", "js", "ecmascript", "node", "nodejs"],
  react: ["react", "jsx"],
  webdevelopment: ["web development", "full stack", "frontend", "backend", "html", "css"],
  python: ["python", "django", "flask"],
  java: ["java", "jvm", "spring", "hibernate"],
  cpp: ["c++", "cpp"],
  csharp: ["c#", "csharp", "dotnet", ".net"]
};

const nonCodingBankMap = {
  powerbi: ["power bi", "powerbi", "business intelligence", "bi"],
  digitalmarketing: ["marketing", "seo", "ads", "social media", "content strategy"]
};

const coursePlans = {
  javascript: [
    {
      chapter: 1,
      title: "Language Fundamentals",
      description: "Variables, data types, operators, and control flow.",
      duration: "2 hours",
      topics: ["let vs const", "Primitive types", "Conditionals", "Loops"]
    },
    {
      chapter: 2,
      title: "Functions and Scope",
      description: "Build reusable logic with proper scoping.",
      duration: "2 hours",
      topics: ["Function declarations", "Arrow functions", "Closures", "Scope chain"]
    },
    {
      chapter: 3,
      title: "Arrays and Objects",
      description: "Work with real-world data structures.",
      duration: "2 hours",
      topics: ["Array methods", "Object patterns", "Destructuring", "Spread/rest"]
    },
    {
      chapter: 4,
      title: "Async JavaScript",
      description: "Handle asynchronous code effectively.",
      duration: "3 hours",
      topics: ["Callbacks", "Promises", "Async/await", "Error handling"]
    },
    {
      chapter: 5,
      title: "DOM and Browser APIs",
      description: "Build interactive web features in the browser.",
      duration: "3 hours",
      topics: ["DOM selection", "Event delegation", "Forms", "Performance basics"]
    }
  ],
  react: [
    {
      chapter: 1,
      title: "React Foundations",
      description: "Components, JSX, and props.",
      duration: "2 hours",
      topics: ["JSX", "Function components", "Props", "Component tree"]
    },
    {
      chapter: 2,
      title: "State and Effects",
      description: "Manage local state and side effects.",
      duration: "3 hours",
      topics: ["useState", "useEffect", "Derived state", "Cleanup"]
    },
    {
      chapter: 3,
      title: "Forms and Data Fetching",
      description: "Build forms and integrate APIs.",
      duration: "3 hours",
      topics: ["Controlled inputs", "Validation", "API calls", "Loading states"]
    },
    {
      chapter: 4,
      title: "Routing and Composition",
      description: "Create scalable app structure.",
      duration: "3 hours",
      topics: ["React Router", "Layout components", "Children", "Reuse patterns"]
    },
    {
      chapter: 5,
      title: "Performance and Production",
      description: "Optimize and prepare for deployment.",
      duration: "2 hours",
      topics: ["Memoization", "Code splitting", "Build setup", "Debugging"]
    }
  ]
};

const defaultNonCodingPlan = [
  {
    chapter: 1,
    title: "Core Concepts",
    description: "Understand the foundational terminology and goals.",
    duration: "2 hours",
    topics: ["Fundamentals", "Key terms", "Use cases", "Common mistakes"]
  },
  {
    chapter: 2,
    title: "Workflow Setup",
    description: "Set up your process for consistent execution.",
    duration: "2 hours",
    topics: ["Planning", "Tool setup", "Templates", "Standards"]
  },
  {
    chapter: 3,
    title: "Practical Application",
    description: "Apply concepts in realistic scenarios.",
    duration: "3 hours",
    topics: ["Case study", "Decision framework", "Metrics", "Iteration"]
  },
  {
    chapter: 4,
    title: "Optimization",
    description: "Improve quality and performance.",
    duration: "2 hours",
    topics: ["Analysis", "Optimization loops", "Risk management", "Reporting"]
  },
  {
    chapter: 5,
    title: "Capstone Execution",
    description: "Complete a final scenario-based assignment.",
    duration: "3 hours",
    topics: ["Project delivery", "Presentation", "Review", "Next steps"]
  }
];

const cloneAndNumberQuiz = (quiz, limit = 5) => {
  return quiz.slice(0, limit).map((item, index) => ({
    questionNumber: index + 1,
    question: item.question,
    options: item.options.slice(0, 4),
    correctAnswer: item.correctAnswer,
    explanation: item.explanation || ""
  }));
};

const titleIncludesAny = (title, keywords = []) => {
  const loweredTitle = title.toLowerCase();
  return keywords.some((keyword) => loweredTitle.includes(keyword));
};

const pickBankByMap = (title, mapObject) => {
  for (const [bankName, keywords] of Object.entries(mapObject)) {
    if (titleIncludesAny(title, keywords)) {
      return bankName;
    }
  }
  return null;
};

const buildGenericCourseQuiz = (title, isCoding) => {
  if (isCoding) {
    return cloneAndNumberQuiz(codingQuizBanks.javascript);
  }

  return cloneAndNumberQuiz([
    {
      question: `In ${title}, what is the best first step before executing tasks?`,
      options: ["Define goals and measurable outcomes", "Start without a plan", "Skip stakeholder alignment", "Avoid documentation"],
      correctAnswer: "Define goals and measurable outcomes",
      explanation: "Clear objectives improve execution quality and evaluation."
    },
    {
      question: "Which approach improves learning retention in non-coding domains?",
      options: ["Scenario-based practice", "Memorization only", "Ignoring feedback", "No reflection"],
      correctAnswer: "Scenario-based practice",
      explanation: "Applying concepts to practical scenarios reinforces understanding."
    },
    {
      question: "What is a reliable way to improve process quality over time?",
      options: ["Review metrics and iterate", "Use one method forever", "Avoid analysis", "Decrease communication"],
      correctAnswer: "Review metrics and iterate",
      explanation: "Continuous improvement depends on measurement and iteration."
    },
    {
      question: "How should teams handle repeated mistakes?",
      options: ["Run root-cause analysis", "Ignore patterns", "Blame individuals only", "Document nothing"],
      correctAnswer: "Run root-cause analysis",
      explanation: "Root-cause analysis leads to long-term corrective actions."
    },
    {
      question: "What makes a final project assessment meaningful?",
      options: ["Clear rubric tied to outcomes", "Subjective scoring only", "No criteria", "Single opinion"],
      correctAnswer: "Clear rubric tied to outcomes",
      explanation: "Outcome-based rubrics provide fair and actionable evaluation."
    },
    {
      question: "Which behavior most improves professional growth?",
      options: ["Regular feedback and reflection", "Avoiding reviews", "Repeating old habits", "Skipping debriefs"],
      correctAnswer: "Regular feedback and reflection",
      explanation: "Feedback loops accelerate skill development."
    }
  ]);
};

const selectQuizForCourse = (courseTitle) => {
  const isCoding = titleIncludesAny(courseTitle, codingCourseKeywords);

  if (isCoding) {
    const codingBank = pickBankByMap(courseTitle, codingBankMap);
    if (codingBank && codingQuizBanks[codingBank]) {
      return {
        isCoding,
        quiz: cloneAndNumberQuiz(codingQuizBanks[codingBank])
      };
    }

    return {
      isCoding,
      quiz: buildGenericCourseQuiz(courseTitle, true)
    };
  }

  const nonCodingBank = pickBankByMap(courseTitle, nonCodingBankMap);
  if (nonCodingBank && nonCodingQuizBanks[nonCodingBank]) {
    return {
      isCoding,
      quiz: cloneAndNumberQuiz(nonCodingQuizBanks[nonCodingBank])
    };
  }

  return {
    isCoding,
    quiz: buildGenericCourseQuiz(courseTitle, false)
  };
};

const selectCoursePlan = (courseTitle, isCoding) => {
  const codingBank = pickBankByMap(courseTitle, codingBankMap);

  if (codingBank && coursePlans[codingBank]) {
    return coursePlans[codingBank];
  }

  if (isCoding) {
    return coursePlans.javascript;
  }

  return defaultNonCodingPlan;
};

const selectCodingProblem = (courseTitle, isCoding) => {
  if (!isCoding) {
    return null; // Non-coding courses don't get coding problems
  }

  const codingBank = pickBankByMap(courseTitle, codingBankMap);
  
  if (codingBank && codingProblemsBank[codingBank]) {
    return [{
      problemNumber: 1,
      ...codingProblemsBank[codingBank]
    }];
  }

  // Default coding problem for coding courses
  return [{
    problemNumber: 1,
    ...codingProblemsBank.generic
  }];
};

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const courses = await Course.find().lean();
    console.log(`Found ${courses.length} courses to update`);

    if (courses.length === 0) {
      console.log("No courses found in database");
      process.exit(1);
    }

    let updatedCount = 0;
    let skippedCount = 0;

    for (const course of courses) {
      try {
        const quizSelection = selectQuizForCourse(course.title || "Untitled Course");
        const selectedQuiz = quizSelection.quiz;
        const selectedPlan = selectCoursePlan(course.title || "", quizSelection.isCoding);
        const selectedCodingProblem = selectCodingProblem(course.title || "", quizSelection.isCoding);

        const updateData = {
          quiz: selectedQuiz,
          coursePlan: selectedPlan,
          quizTimeLimit: 20 // 20 minutes for quiz
        };

        if (selectedCodingProblem) {
          updateData.codingProblems = selectedCodingProblem;
        }

        const updatedCourse = await Course.findByIdAndUpdate(
          course._id,
          updateData,
          { new: true }
        );

        if (updatedCourse) {
          console.log(`Updated: ${course.title}`);
          console.log(`  - Added ${selectedQuiz.length} quiz questions`);
          console.log(`  - Added ${selectedPlan.length} chapters`);
          if (selectedCodingProblem) {
            console.log(`  - Added 1 coding problem`);
          }
          console.log(`  - Quiz time limit: 20 minutes`);
          updatedCount += 1;
        } else {
          console.log(`Failed to update: ${course.title}`);
          skippedCount += 1;
        }
      } catch (error) {
        console.log(`Error updating ${course.title}: ${error.message}`);
        skippedCount += 1;
      }
    }

    console.log("=".repeat(50));
    console.log("Seeding Complete");
    console.log(`Updated: ${updatedCount} courses`);
    console.log(`Skipped: ${skippedCount} courses`);
    console.log("=".repeat(50));

    console.log("What was added:");
    console.log("  - 5 quiz questions (multiple choice) per course");
    console.log("  - 1 coding problem (write actual code) for coding courses");
    console.log("  - 20-minute time limit for quiz attempts");
    console.log("  - 5-chapter course curriculum aligned to each course category");

    process.exit(0);
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
}

seedDatabase();
