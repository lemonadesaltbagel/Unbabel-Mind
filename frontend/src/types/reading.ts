export type QuestionType='intro'|'subheading'|'tfng'|'single'|'multi'|'fill-in-line';
export type Question={type:'intro';text:string}|{type:'subheading';text:string}|{type:'tfng'|'single'|'multi';number:number;question:string;options:string[]}|{type:'fill-in-line';number:number;text:string};
export type Highlight={text:string;start:number;end:number;textId:string};
export type Answers=Record<number,string[]>;
export type SubmissionPayload={passageId:number;questionType:number;userId:number;answers:Array<{questionId:number;userAnswer:string[]}>}; 