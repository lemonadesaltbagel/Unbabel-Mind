export interface User{id:string;firstName:string;lastName:string;email:string;}
export interface AuthResponse{token:string;user:User;}
export interface Passage{id:string;title:string;content:string;questions:Question[];completed?:boolean;}
export interface Question{id:string;text:string;options:string[];correctAnswer:number;}
export interface AnswerSubmission{answers:Record<string,number>;}
export interface SubmissionResult{score:number;correctAnswers:number;totalQuestions:number;}
export interface Progress{completedPassages:string[];totalPassages:number;averageScore:number;} 