import { Request, Response } from 'express';
import { createAnswer, getAnswersByUserAndPassage } from '../models/Answer';
import { createEssay, getEssayByUserAndPassage } from '../models/Essay';
import { getQuestionsByPassage } from '../models/Question';
import { createResult, getResultsByUser, getResultsByUserAndType } from '../models/Result';
import { findUserById } from '../models/User';
import fs from 'fs';
import path from 'path';

const loadCorrectAnswers = (passageId: number, questionType: number): Record<number, string> => {
  try {
    const filePath = path.join(
      __dirname, 
      '../../public/static', 
      questionType === 1 ? 'reading' : 'listening', 
      `${passageId}_${questionType}_a.json`
    );
    const data = fs.readFileSync(filePath, 'utf8');
    const answers = JSON.parse(data);
    const result: Record<number, string> = {};
    
    answers.forEach((answer: any) => {
      result[answer.number] = answer.correctAnswer;
    });
    
    return result;
  } catch {
    return {};
  }
};

export const submitAnswer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { passageId, questionType, userId, answers, essay } = req.body;
    
    if (!userId) {
      res.status(400).json({ success: false, message: 'User ID is required' });
      return;
    }
    
    const user = await findUserById(userId);
    if (!user) {
      res.status(400).json({ success: false, message: 'User not found. Please log in again.' });
      return;
    }
    
    if (essay !== undefined) {
      await createEssay(userId, passageId, questionType, essay);
      await createResult(userId, passageId, questionType, null, null, null);
      res.json({ success: true, message: 'Essay submitted successfully' });
    } else if (answers && Array.isArray(answers)) {
      const answerPromises = answers.map(answer => 
        createAnswer(userId, passageId, questionType, answer.questionId, answer.userAnswer)
      );
      await Promise.all(answerPromises);
      
      const correctAnswers = loadCorrectAnswers(passageId, questionType);
      const correctCount = answers.filter(answer => {
        const correctAnswer = correctAnswers[answer.questionId];
        if (!correctAnswer) return false;
        
        const userAnswer = answer.userAnswer;
        if (userAnswer.length === 1 && userAnswer[0] === '—') return false;
        
        return JSON.stringify(Array.isArray(correctAnswer) ? correctAnswer.sort() : [correctAnswer].sort()) === 
               JSON.stringify(userAnswer.sort());
      }).length;
      
      const totalQuestions = answers.length;
      const score = Math.round((correctCount / totalQuestions) * 100);
      
      await createResult(userId, passageId, questionType, score, correctCount, totalQuestions);
      
      res.json({
        success: true,
        score: score,
        correctAnswers: correctCount,
        totalQuestions: totalQuestions,
        message: 'Answers submitted successfully'
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid request data' });
    }
  } catch (error: any) {
    console.error('Error submitting answer:', error);
    if (error.code === '23503') {
      res.status(400).json({ success: false, message: 'User not found. Please log in again.' });
    } else {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
};

export const getAnswers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { passageId, questionType, userId } = req.params;
    const answers = await getAnswersByUserAndPassage(Number(userId), Number(passageId), Number(questionType));
    res.json({ success: true, data: answers });
  } catch (error: any) {
    console.error('Error getting answers:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getEssay = async (req: Request, res: Response): Promise<void> => {
  try {
    const { passageId, questionType, userId } = req.params;
    const essay = await getEssayByUserAndPassage(Number(userId), Number(passageId), Number(questionType));
    res.json({ success: true, data: essay });
  } catch (error: any) {
    console.error('Error getting essay:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getUserResults = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const results = await getResultsByUser(Number(userId));
    res.json({ success: true, data: results });
  } catch (error: any) {
    console.error('Error getting user results:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getUserResultsByType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, questionType } = req.params;
    const results = await getResultsByUserAndType(Number(userId), Number(questionType));
    res.json({ success: true, data: results });
  } catch (error: any) {
    console.error('Error getting user results by type:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getResultsWithCorrectAnswers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { passageId, questionType, userId } = req.params;
    const answers = await getAnswersByUserAndPassage(Number(userId), Number(passageId), Number(questionType));
    const correctAnswers = loadCorrectAnswers(Number(passageId), Number(questionType));
    
    const results = answers.map((answer: any) => {
      const correctAnswer = correctAnswers[answer.question_id];
      const userAnswer = answer.user_answer;
      const isCorrect = JSON.stringify(Array.isArray(correctAnswer) ? correctAnswer.sort() : [correctAnswer].sort()) === 
                       JSON.stringify(userAnswer.sort());
      
      return {
        questionId: answer.question_id,
        userAnswer: userAnswer,
        correctAnswer: correctAnswer,
        isCorrect: isCorrect
      };
    });
    
    res.json({ success: true, data: results });
  } catch (error: any) {
    console.error('Error getting results with correct answers:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}; 