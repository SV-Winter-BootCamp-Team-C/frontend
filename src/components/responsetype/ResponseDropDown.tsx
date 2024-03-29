import { useState } from 'react';
import typeIcon from '@/assets/type.svg';
import { QuestionData } from '@/types/questionData';

interface ResponseDropDownProps {
  question: QuestionData;
  color: string;
  index: number;
  onOptionSelect: (choiceId: number) => void;
}

function ResponseDropDown({ question, color, index, onOptionSelect }: ResponseDropDownProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleOptionSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(Number(event.target.value));
    onOptionSelect(Number(event.target.value));
  };

  return (
    <div
      className="flex flex-col items-center justify-center rounded-[1.25rem] bg-white"
      style={{
        boxShadow: `0 0 0.25rem 0.25rem ${color}40`,
      }}
    >
      <div className="flex justify-start w-full mt-4">
        <div className="flex items-center ml-4">
          <img src={typeIcon} alt="Type" className="w-5 h-5" />
          <span className="ml-2 font-medium text-left text-darkGray">드롭다운</span>
        </div>
      </div>

      <div className="flex items-center justify-center w-full">
        <span className="text-[2rem] font-semibold text-center text-black -translate-y-4">Q{index}.</span>
      </div>

      <span className="max-w-[37.5rem] text-[1rem] mt-[0.5rem] mb-6 text-center text-black">{question.content}</span>

      {question.imageUrl && (
        <img
          src={question.imageUrl}
          alt="Question"
          className="rounded-[0.625rem] max-w-[45rem] max-h-[45rem]"
          style={{ border: `0.125rem solid ${color}` }}
        />
      )}

      <div className="my-4">
        <select
          value={selectedOption ?? ''}
          onChange={handleOptionSelect}
          className="border border-gray-300 rounded-md"
          style={{ width: '20rem', height: '2rem', border: `0.0625rem solid ${color}` }}
        >
          <option value="">선택...</option>
          {question.choices?.map((choice) => (
            <option key={choice.choiceId} value={choice.choiceId}>
              {choice.option}
            </option>
          ))}
        </select>
      </div>
      {selectedOption !== null && (
        <div className="mb-4">
          <p>You selected: {question.choices?.find((choice) => choice.choiceId === selectedOption)?.option}</p>
        </div>
      )}
    </div>
  );
}

export default ResponseDropDown;
