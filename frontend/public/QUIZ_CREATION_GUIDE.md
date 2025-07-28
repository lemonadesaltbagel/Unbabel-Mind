# 📚 How to Add Your Own Quizzes to Unbabel Mind

Welcome to the comprehensive guide for creating custom quizzes in Unbabel Mind! This guide will walk you through the entire process of adding your own reading and listening quizzes with questions, answers, and evidence.

{Quiz creation workflow diagram showing the three main file types and their relationships}

## 🎯 What You'll Learn

By the end of this guide, you'll be able to:
- ✅ Create reading passages and audio transcripts
- ✅ Design various question types (True/False/Not Given, Multiple Choice, Fill-in-the-blank)
- ✅ Provide correct answers and supporting evidence
- ✅ Structure your quiz data properly
- ✅ Test and deploy your custom quizzes

## 📁 Understanding the File Structure

Each quiz in Unbabel Mind consists of **three essential files**:

```
frontend/public/static/
├── reading/
│   ├── [quiz_id]_[type].txt      # 📄 Reading passage
│   ├── [quiz_id]_[type]_q.json   # ❓ Questions and answers
│   └── [quiz_id]_[type]_e.json   # 🔍 Evidence for answers
└── listening/
    ├── [quiz_id]_[type].txt      # 🎧 Audio transcript
    ├── [quiz_id]_[type]_q.json   # ❓ Questions and answers
    └── [quiz_id]_[type]_e.json   # 🔍 Evidence for answers
```

### File Naming Convention
- **Quiz ID**: A unique identifier (e.g., `20`, `21`, `22`)
- **Type**: The question type number (e.g., `1`, `2`, `3`, `4`)
- **Example**: `20_1.txt` = Quiz 20, Type 1

{File structure diagram showing the three files and their purposes}

## 📄 Step 1: Creating the Passage/Transcript File

### For Reading Quizzes (`[quiz_id]_[type].txt`)

Create a text file with the following structure:

```txt
Title of Your Reading Passage

Your reading passage content goes here. This should be a comprehensive text that provides enough information for students to answer the questions you'll create later.

The passage should be well-structured with clear paragraphs and contain factual information that can be used to create various types of questions.

Make sure your content is engaging and appropriate for the target audience level.
```

### For Listening Quizzes (`[quiz_id]_[type].txt`)

Create a transcript file with the same structure:

```txt
Title of Your Audio Transcript

This is the transcript of the audio that students will listen to. It should contain all the spoken content, including:

- Speaker dialogue
- Descriptions of sounds or actions
- Any relevant background information
- Clear markers for different speakers if applicable

The transcript should match exactly what students hear in the audio recording.
```

{Example of a well-formatted passage file}

## ❓ Step 2: Creating Questions (`[quiz_id]_[type]_q.json`)

This is the most important file! It contains all your questions, answer options, and correct answers.

### Question Types Supported

1. **Intro** - Instructions for a question section
2. **Subheading** - Section headers
3. **True/False/Not Given (TFNG)** - True/False/Not Given questions
4. **Single Choice** - Multiple choice with one correct answer
5. **Multi Choice** - Multiple choice with multiple correct answers
6. **Fill-in-line** - Fill in the blank questions

### JSON Structure

```json
[
  {
    "type": "intro",
    "text": "Questions 1-6\n\nDo the following statements agree with the information given in Reading Passage 1?\nIn boxes 1–6 on your answer sheet, write\nTRUE           if the statement agrees with the information\nFALSE         if the statement contradicts the information\nNOT GIVEN  if there is no information on this"
  },
  {
    "type": "tfng",
    "number": 1,
    "question": "Your question text here?",
    "options": ["TRUE", "FALSE", "NOT GIVEN"],
    "correctAnswer": "TRUE"
  },
  {
    "type": "single",
    "number": 2,
    "question": "What is the main purpose of this passage?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A"
  },
  {
    "type": "multi",
    "number": 3,
    "question": "Which of the following are mentioned in the passage?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": ["Option A", "Option C"]
  },
  {
    "type": "subheading",
    "text": "Section Title"
  },
  {
    "type": "fill-in-line",
    "number": 4,
    "text": "The answer is ____ and the result is ____.",
    "correctAnswer": "correct"
  }
]
```

### Question Type Details

#### 1. Intro Questions
```json
{
  "type": "intro",
  "text": "Your instruction text here"
}
```

#### 2. Subheading Questions
```json
{
  "type": "subheading", 
  "text": "Your section title"
}
```

#### 3. True/False/Not Given Questions
```json
{
  "type": "tfng",
  "number": 1,
  "question": "Your statement here?",
  "options": ["TRUE", "FALSE", "NOT GIVEN"],
  "correctAnswer": "TRUE"
}
```

#### 4. Single Choice Questions
```json
{
  "type": "single",
  "number": 2,
  "question": "Your question here?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "Option A"
}
```

#### 5. Multi Choice Questions
```json
{
  "type": "multi",
  "number": 3,
  "question": "Which of the following are correct?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": ["Option A", "Option C"]
}
```

#### 6. Fill-in-line Questions
```json
{
  "type": "fill-in-line",
  "number": 4,
  "text": "The answer is ____ and the result is ____.",
  "correctAnswer": "correct"
}
```

{Visual examples of each question type}

## 🔍 Step 3: Creating Evidence (`[quiz_id]_[type]_e.json`)

The evidence file provides supporting text from the passage/transcript that justifies each correct answer.

### JSON Structure

```json
[
  {
    "number": 1,
    "text": "This is the specific text from the passage that supports the correct answer for question 1."
  },
  {
    "number": 2,
    "text": "This is the specific text from the passage that supports the correct answer for question 2."
  },
  {
    "number": 3,
    "text": "This is the specific text from the passage that supports the correct answer for question 3."
  }
]
```

### Evidence Guidelines

- **Be Specific**: Quote the exact text that supports the answer
- **Be Concise**: Keep evidence focused and relevant
- **Include Context**: Provide enough context to understand the answer
- **Match Question Numbers**: Each evidence entry should correspond to a question number

{Example showing how evidence connects to questions and answers}

## 🛠️ Step-by-Step Creation Process

### Step 1: Plan Your Quiz
1. **Choose a Topic**: Select an engaging subject for your quiz
2. **Determine Question Types**: Decide which types of questions to include
3. **Create an Outline**: Plan the structure of your passage and questions

### Step 2: Write Your Passage/Transcript
1. **Create the Text File**: Save as `[quiz_id]_[type].txt`
2. **Add Title**: First line should be the title
3. **Write Content**: Create comprehensive, factual content
4. **Review**: Ensure clarity and accuracy

### Step 3: Design Your Questions
1. **Create the JSON File**: Save as `[quiz_id]_[type]_q.json`
2. **Add Instructions**: Include intro questions for each section
3. **Create Questions**: Add various question types
4. **Set Correct Answers**: Ensure accuracy

### Step 4: Provide Evidence
1. **Create the Evidence File**: Save as `[quiz_id]_[type]_e.json`
2. **Quote Supporting Text**: Extract relevant passages
3. **Match Question Numbers**: Ensure correspondence
4. **Verify Accuracy**: Double-check all evidence

### Step 5: Test Your Quiz
1. **Validate JSON**: Ensure proper formatting
2. **Check File Names**: Verify naming convention
3. **Test in Application**: Load and test the quiz
4. **Review Results**: Verify scoring and feedback

{Step-by-step workflow diagram}

## 📋 Example: Complete Quiz Creation

Let's create a complete example quiz about "Climate Change":

### 1. Passage File (`21_1.txt`)
```txt
Climate Change: A Global Challenge

Climate change represents one of the most significant challenges facing humanity in the 21st century. The Earth's average temperature has increased by approximately 1.1 degrees Celsius since pre-industrial times, primarily due to human activities such as burning fossil fuels and deforestation.

The primary greenhouse gas responsible for global warming is carbon dioxide (CO2), which is released when we burn coal, oil, and natural gas for energy. Other significant greenhouse gases include methane, nitrous oxide, and fluorinated gases. These gases trap heat in the Earth's atmosphere, creating what is known as the greenhouse effect.

The consequences of climate change are already visible worldwide. Rising sea levels threaten coastal communities, extreme weather events are becoming more frequent and intense, and many species are struggling to adapt to changing conditions. The Arctic is warming at twice the global average rate, leading to melting ice caps and permafrost.

Scientists have identified several key solutions to address climate change. Renewable energy sources such as solar, wind, and hydroelectric power can replace fossil fuels. Energy efficiency measures can reduce overall energy consumption. Reforestation and forest conservation can help absorb CO2 from the atmosphere.

Individual actions also play a crucial role in combating climate change. Simple steps such as using energy-efficient appliances, reducing car travel, and supporting sustainable products can make a significant difference when adopted by millions of people worldwide.
```

### 2. Questions File (`21_1_q.json`)
```json
[
  {
    "type": "intro",
    "text": "Questions 1-5\n\nDo the following statements agree with the information given in the reading passage?\nIn boxes 1–5 on your answer sheet, write\nTRUE           if the statement agrees with the information\nFALSE         if the statement contradicts the information\nNOT GIVEN  if there is no information on this"
  },
  {
    "type": "tfng",
    "number": 1,
    "question": "The Earth's temperature has increased by more than 2 degrees Celsius since pre-industrial times.",
    "options": ["TRUE", "FALSE", "NOT GIVEN"],
    "correctAnswer": "FALSE"
  },
  {
    "type": "tfng",
    "number": 2,
    "question": "Carbon dioxide is the only greenhouse gas contributing to global warming.",
    "options": ["TRUE", "FALSE", "NOT GIVEN"],
    "correctAnswer": "FALSE"
  },
  {
    "type": "tfng",
    "number": 3,
    "question": "The Arctic is experiencing faster warming than the global average.",
    "options": ["TRUE", "FALSE", "NOT GIVEN"],
    "correctAnswer": "TRUE"
  },
  {
    "type": "intro",
    "text": "\n\nQuestions 4-6\nComplete the summary below.\n\nChoose ONE WORD from the passage for each answer."
  },
  {
    "type": "fill-in-line",
    "number": 4,
    "text": "The main cause of climate change is the burning of ____ fuels.",
    "correctAnswer": "fossil"
  },
  {
    "type": "fill-in-line",
    "number": 5,
    "text": "Renewable energy sources include solar, wind, and ____ power.",
    "correctAnswer": "hydroelectric"
  }
]
```

### 3. Evidence File (`21_1_e.json`)
```json
[
  {
    "number": 1,
    "text": "The Earth's average temperature has increased by approximately 1.1 degrees Celsius since pre-industrial times"
  },
  {
    "number": 2,
    "text": "Other significant greenhouse gases include methane, nitrous oxide, and fluorinated gases"
  },
  {
    "number": 3,
    "text": "The Arctic is warming at twice the global average rate"
  },
  {
    "number": 4,
    "text": "The primary greenhouse gas responsible for global warming is carbon dioxide (CO2), which is released when we burn coal, oil, and natural gas for energy"
  },
  {
    "number": 5,
    "text": "Renewable energy sources such as solar, wind, and hydroelectric power can replace fossil fuels"
  }
]
```

{Complete example showing all three files working together}

## 🎯 Best Practices

### Content Creation
- **Choose Engaging Topics**: Select subjects that interest your target audience
- **Ensure Accuracy**: Verify all facts and information
- **Maintain Appropriate Difficulty**: Match content to student level
- **Include Variety**: Use different question types for engagement

### Question Design
- **Be Clear and Concise**: Write unambiguous questions
- **Avoid Trick Questions**: Focus on comprehension, not confusion
- **Provide Plausible Options**: Make all answer choices reasonable
- **Test Your Questions**: Ensure they work as intended

### Evidence Quality
- **Quote Accurately**: Use exact text from the passage
- **Provide Sufficient Context**: Include enough information to justify the answer
- **Be Specific**: Avoid vague or general statements
- **Cross-Reference**: Verify evidence matches questions and answers

### File Management
- **Use Consistent Naming**: Follow the established convention
- **Validate JSON**: Check for proper formatting
- **Backup Your Work**: Keep copies of your files
- **Test Thoroughly**: Verify everything works before deployment

{Best practices checklist}

## 🚀 Deployment

### Adding Your Quiz to the System

1. **Place Files**: Copy your three files to the appropriate directory:
   - Reading: `frontend/public/static/reading/`
   - Listening: `frontend/public/static/listening/`

2. **Verify Structure**: Ensure all files follow the naming convention

3. **Test Locally**: Run the application and test your quiz

4. **Deploy**: Upload your files to the production environment

### Accessing Your Quiz

Your quiz will be available at:
- Reading: `/reading/[quiz_id]/[type]`
- Listening: `/listening/[quiz_id]/[type]`

Example: `/reading/21/1` for Quiz 21, Type 1

{Deployment workflow diagram}

## 🔧 Troubleshooting

### Common Issues and Solutions

#### JSON Formatting Errors
**Problem**: Quiz doesn't load or shows errors
**Solution**: Validate JSON syntax using online tools

#### Missing Evidence
**Problem**: AI feedback doesn't work properly
**Solution**: Ensure every question has corresponding evidence

#### Incorrect File Names
**Problem**: Quiz doesn't appear in the application
**Solution**: Check naming convention and file locations

#### Question Number Mismatch
**Problem**: Evidence doesn't match questions
**Solution**: Verify question numbers in all files are consistent

{Common troubleshooting scenarios}

## 📚 Additional Resources

### Tools for Quiz Creation
- **JSON Validator**: [jsonlint.com](https://jsonlint.com)
- **Text Editor**: VS Code, Sublime Text, or Notepad++
- **Markdown Editor**: Typora or Obsidian for planning

### Reference Materials
- **IELTS Question Types**: Study official IELTS materials
- **Academic Writing**: Review academic text structures
- **Question Design**: Learn about effective assessment design

### Support
- **Documentation**: Check the main README for technical details
- **Community**: Join our community forums for help
- **Feedback**: Share your quiz creations with others

{Additional resources and tools}

## 🎉 Congratulations!

You've now learned how to create comprehensive quizzes for Unbabel Mind! With this knowledge, you can:

- ✅ Create engaging reading and listening content
- ✅ Design various question types to test different skills
- ✅ Provide accurate answers and supporting evidence
- ✅ Contribute to the learning experience of students worldwide

Remember, the key to great quizzes is **quality content**, **clear questions**, and **accurate evidence**. Take your time, test thoroughly, and don't hesitate to iterate and improve your quizzes based on student feedback.

Happy quiz creating! 🚀

---

*This guide is part of the Unbabel Mind project. For technical support or questions about the application, please refer to the main documentation.* 