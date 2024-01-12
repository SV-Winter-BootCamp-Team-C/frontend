import typeIcon from '@/assets/type.svg';
import { ExtendedQuestionData } from '@/types/questionData';

interface StaticSubjectiveProps {
  question: ExtendedQuestionData;
}

function StaticSubjective({ question }: StaticSubjectiveProps) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-[1.25rem] bg-white border border-purple"
      style={{ boxShadow: '0 0 0.25rem 0.25rem rgba(145,141,202,0.25)' }}
    >
      <div className="flex justify-start w-full mt-4">
        <div className="flex items-center ml-4">
          <img src={typeIcon} alt="Type" className="w-5 h-5" />
          <span className="ml-2 font-medium text-left text-darkGray">주관식</span>
        </div>
      </div>

      <div className="flex justify-center items-center w-full">
        <span className="text-[2rem] font-semibold text-center text-black -translate-y-4">
          Q{question.question_id}.
        </span>
      </div>

      <span className="max-w-[37.5rem] text-[1rem] mt-[0.5rem] mb-6 text-center text-black">{question.content}</span>

      {question.image_url && (
        <img
          src={question.image_url}
          alt="Question"
          className="rounded-[0.625rem] border-2 border-solid border-gray max-w-[45rem] max-h-[45rem]"
        />
      )}
      <div className="w-[25rem] my-4">
        <textarea
          value={question.subContent}
          readOnly // 읽기 전용으로 설정
          rows={4}
          className="w-full p-2 rounded-md border border-gray"
          style={{ overflowY: 'auto', resize: 'vertical' }}
        />
      </div>
    </div>
  );
}

export default StaticSubjective;
