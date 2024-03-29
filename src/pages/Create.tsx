import { useState } from 'react';
import { SketchPicker } from 'react-color';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { AddButton, TextButton } from '@/components/common/Button';
import MultipleChoice from '@/components/surveytype/MultipleChoice';
import Checkbox from '@/components/surveytype/CheckBox';
import DropDown from '@/components/surveytype/DropDown';
import Subjective from '@/components/surveytype/Subjective';
import CreateQuestionMenu from '@/components/createSurvey/CreateQuestionMenu';
import { useMutation } from '@tanstack/react-query';
import { createSurveyAPI } from '@/api/survey';
import { useAuthStore } from '@/store/AuthStore';
import { ButtonItem, FontItem, OptionItem } from '@/types/create';
import { EditableQuestions, EditableSurvey } from '@/types/editableSurvey';
import { getRoundedClass } from '@/utils/getRoundedClass';
import Alert from '@/components/common/Alert';
import { useNavigate } from 'react-router-dom';
import { useNavbarStore } from '@/store/NavbarStore';
import deleteIcon from '../assets/deleteIcon.svg';
import ImageSearchModal from '../components/common/ImageSearchModal';
import privateIcon from '../assets/privateIcon.svg';
import publicIcon from '../assets/publicIcon.svg';
import insertImage from '../assets/insertImage.svg';

const BUTTON_ITEMS: ButtonItem[] = [
  { id: 'angled', label: '각지게' },
  { id: 'smooth', label: '부드럽게' },
  { id: 'round', label: '둥글게' },
];

const COROL_ITEMS: string[][] = [
  ['#918DCA', '#A3C9F0', '#66C03B', '#E4E91D'],
  ['#8E8E8E', '#B4B4B4', '#E90D0D', '#FF9C06'],
];

const FONT_ITEMS: FontItem[] = [
  { id: 'pretendard', fontClass: 'font-pretendardFont', text: '프리텐다드' },
  { id: 'tmoney', fontClass: 'font-tMoney', text: '티머니 둥근바람' },
  { id: 'nps', fontClass: 'font-npsFont', text: '국민연금체' },
  { id: 'omyu', fontClass: 'font-omyuFont', text: '오뮤 다예쁨체' },
  { id: 'seolleim', fontClass: 'font-seolleimFont', text: '시원한 설레임체' },
];

const OPTION_ITEMS: OptionItem[] = [
  { id: 'public', icon: 'publicIcon', text: '공개' },
  { id: 'private', icon: 'privateIcon', text: '비공개' },
];

function Create() {
  const userId = useAuthStore((state) => state.userId);
  const activeItem = useNavbarStore((state) => state.activeItem);
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState<'style' | 'problem'>('style');
  const [createSurvey, setCreateSurvey] = useState<EditableSurvey>({
    userId: userId as number,
    title: '',
    description: '',
    open: true,
    buttonStyle: 'angled',
    color: '#918DCA',
    font: 'pretendard',
    deadline: '',
    questions: [],
  });
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [customColor, setCustomColor] = useState<string>('#640FF2');
  const [mainImg, setMainImg] = useState<string | null>();
  const [mainImgFile, setMainImgFile] = useState<File | null>(null);
  const [addQuestionDropdown, setAddQuestionDropdown] = useState<boolean>(false);
  const [isImageSearchModalVisible, setImageSearchModalVisible] = useState(false);

  const { mutate, isSuccess, isError } = useMutation({
    mutationFn: createSurveyAPI,
  });

  const handlePageClick = () => {
    setActivePage((prev) => (prev === 'style' ? 'problem' : 'style'));
  };

  const changeButtonStyle = (style: 'angled' | 'smooth' | 'round') => {
    setCreateSurvey({ ...createSurvey, buttonStyle: style });
  };

  const handleCustomColorChange = (selectedColor: { hex: string }) => {
    setCustomColor(selectedColor.hex);
    setCreateSurvey({ ...createSurvey, color: selectedColor.hex });
  };

  const toggleColorPicker = () => {
    setShowPicker(!showPicker);
  };

  const handleOptionClick = (optionId: string) => {
    const isOpen = optionId === 'public';
    setCreateSurvey({ ...createSurvey, open: isOpen });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && files[0]) {
      const file = files[0];
      setMainImgFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setMainImg(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageSearchClick = () => {
    setImageSearchModalVisible(true);
  };

  const handleSelectImage = (imageUrl: string) => {
    setMainImg(imageUrl); // 선택된 이미지 URL을 imageSrc 상태에 저장
    setImageSearchModalVisible(false); // 이미지 검색 모달을 닫음
  };
  // 이미지 삭제
  const handleDeleteImage = () => {
    setMainImg(null);
    setMainImgFile(null);
  };

  const handleAddQuestion = () => {
    setAddQuestionDropdown((prev) => !prev);
  };

  const addQuestion = (type: 'MULTIPLE_CHOICE' | 'SUBJECTIVE_QUESTION' | 'CHECKBOX' | 'DROPDOWN') => {
    let newQuestion: EditableQuestions;
    if (type === 'SUBJECTIVE_QUESTION') {
      newQuestion = {
        type,
        content: '',
        imageUrl: '',
      };
    } else {
      newQuestion = {
        type,
        content: '',
        imageUrl: '',
        choices: [],
      };
    }
    setCreateSurvey((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
    setAddQuestionDropdown(false);
  };

  // const updateQuestion = (index: number, updatedData: EditableQuestions) => {
  //   setCreateSurvey((prev) => {
  //     const updatedQuestions = [...prev.questions];
  //     updatedQuestions[index] = updatedData;
  //     return { ...prev, questions: updatedQuestions };
  //   });
  // };

  const renderQuestionComponent = (type: 'MULTIPLE_CHOICE' | 'SUBJECTIVE_QUESTION' | 'CHECKBOX' | 'DROPDOWN') => {
    switch (type) {
      case 'MULTIPLE_CHOICE': // 객관식 문항
        return <MultipleChoice />;
      case 'CHECKBOX': // 체크박스 문항
        return <Checkbox />;
      case 'DROPDOWN': // 드롭다운 문항
        return <DropDown />;
      case 'SUBJECTIVE_QUESTION': // 주관식 문항
        return <Subjective />;
      default:
        return null;
    }
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('userId', userId?.toString() as string);
    formData.append('title', createSurvey.title);
    formData.append('description', createSurvey.description);
    formData.append('open', createSurvey.open.toString());
    formData.append('color', createSurvey.color);
    formData.append('buttonStyle', createSurvey.buttonStyle);
    if (mainImgFile) formData.append('mainImageUrl', mainImgFile);
    formData.append('deadline', createSurvey.deadline);
    // formData.append('questions', );

    mutate(formData);
  };

  console.log(createSurvey);

  return (
    <Scrollbars style={{ position: 'absolute', top: '2.25rem', right: '0.1rem', width: 1080, height: 830 }}>
      <div
        className="relative flex w-[18.75rem] h-[3.75rem] mx-[24.38rem] rounded-[1.25rem] bg-white"
        style={{ boxShadow: '4px 4px 4px 0 rgba(0,0,0,0.25)' }}
      >
        <div className="flex flex-row justify-center gap-3 mx-6 my-4">
          <div className="flex flex-col items-center w-[7.5rem] h-7 cursor-pointer" onClick={() => handlePageClick()}>
            <div className="flex">
              <span className="text-[1.25rem] text-center text-black font-semibold">스타일</span>
            </div>
          </div>

          <div className="flex flex-col items-center w-[7.5rem] h-7 cursor-pointer" onClick={() => handlePageClick()}>
            <div className="flex">
              <span className="text-[1.25rem] text-center text-black font-semibold">문제</span>
            </div>
          </div>
        </div>
        <div
          className="absolute bottom-3 h-1 bg-[#918DCA] transition-all duration-300 ease-in-out"
          style={{ width: '6.25rem', left: activePage === 'style' ? '10%' : '55%' }}
        />
      </div>

      {/* 스타일 선택 */}
      {activePage === 'style' ? (
        <div className="flex flex-col mt-[2.63rem] ml-[3.12rem]">
          <div className="flex items-center">
            <div className="flex w-[5.625rem] h-[2.0315rem]">
              <span className="text-[2rem] font-semibold">제목 :</span>
            </div>
            <div className="flex items-center w-[16.25rem] h-[3.125rem] rounded-[0.625rem] ml-[0.63rem] border-solid border-[0.00625rem] border-[#B4B4B4] hover:border-[0.125rem] hover:border-darkGray">
              <input
                name="title"
                type="text"
                value={createSurvey.title}
                onChange={(e) => setCreateSurvey({ ...createSurvey, title: e.target.value })}
                required
                placeholder="제목을 입력해주세요."
                className="w-full h-[3.75rem] text-[1.25rem] text-black pl-[0.63rem] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col mt-[2.63rem]">
            <div className="flex w-[7.625rem] h-[2.0315rem] items-center">
              <span className="text-[2rem] font-semibold">설명</span>
            </div>
            <div className="flex items-start justify-center w-[25rem] h-[6.25rem] rounded-[0.625rem] mt-[1.22rem] border-solid border-[0.00625rem] border-[#B4B4B4] hover:border-[0.125rem] hover:border-darkGray">
              <textarea
                name="description"
                value={createSurvey.description}
                onChange={(e) => setCreateSurvey({ ...createSurvey, description: e.target.value })}
                required
                placeholder="내용을 입력해주세요."
                className="flex w-[24rem] h-[6rem] text-[1.25rem] rounded-[0.625rem] text-black px-1 py-[0.63rem] border-none resize-none focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col mt-[2.63rem]">
            <div className="flex w-[5.625rem] h-[2.0315rem] mb-[1.01rem]">
              <span className="text-[2rem] font-semibold">버튼</span>
            </div>
            <div className="flex flex-row gap-3">
              {BUTTON_ITEMS.map((item) => (
                <div key={item.id} className="flex flex-col items-center" onClick={() => changeButtonStyle(item.id)}>
                  <div
                    className={`flex justify-center items-center w-[10.5rem] h-[5.5rem] rounded-[1.5rem] border-solid border-[0.188rem] ${
                      createSurvey.buttonStyle === item.id ? `border-purple` : 'border-white'
                    }`}
                  >
                    <div className="flex justify-center items-center w-40 h-20 rounded-[1.25rem] border-solid border-[0.06rem] gap-2 border-[#B4B4B4]">
                      <div
                        className={`flex flex-shrink-0 w-[6.25rem] h-[1.875rem] bg-[#918DCA] ${getRoundedClass(
                          item.id,
                        )}`}
                      />
                    </div>
                  </div>
                  <div className="flex w-[4rem] h-5 justify-center items-center mt-[0.63rem]">
                    <span
                      className={`text-[1rem] font-medium ${
                        createSurvey.buttonStyle === item.id ? 'text-black' : 'text-[#B4B4B4]'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col mt-[2.63rem]">
            <div className="flex w-[5.625rem] h-[2.0315rem] mb-[1.01rem]">
              <span className="text-[2rem] font-semibold">테마</span>
            </div>
            <div className="flex flex-row items-start">
              <div className="flex flex-col w-[9.75rem] h-[4.5rem] ">
                <div className="flex flex-shrink-0 flex-row items-center w-[9.75rem] h-[1.875rem] gap-3">
                  {COROL_ITEMS[0].map((item) => {
                    return (
                      <button
                        aria-label={`Select color ${item}`}
                        type="button"
                        className={`w-8 h-8 rounded-full ${
                          createSurvey.color === item ? 'ring-2 ring-offset-2 ring-purple' : ''
                        }}`}
                        style={{ backgroundColor: item }}
                        onClick={() => setCreateSurvey({ ...createSurvey, color: item })}
                      />
                    );
                  })}
                </div>
                <div className="flex flex-shrink-0 flex-row items-center w-[9.75rem] h-[1.875rem] mt-3 gap-3">
                  {COROL_ITEMS[1].map((item) => {
                    return (
                      <button
                        aria-label={`Select color ${item}`}
                        type="button"
                        className={`w-8 h-8 rounded-full ${
                          createSurvey.color === item ? 'ring-2 ring-offset-2 ring-purple' : ''
                        }}`}
                        style={{ backgroundColor: item }}
                        onClick={() => setCreateSurvey({ ...createSurvey, color: item })}
                      />
                    );
                  })}
                </div>
              </div>
              {/* 커스텀 컬러 선택 */}
              {/* TODO: 투명도 변경 X */}
              <div
                className={`relative flex w-10 h-10 rounded-[0.625rem] cursor-pointer items-center mt-4 ml-[1.56rem] ${
                  createSurvey.color === customColor ? 'ring-2 ring-offset-2 ring-purple' : ''
                }`}
                style={{ backgroundColor: customColor }}
                onClick={toggleColorPicker}
              />
              <div className="absolute bottom-[5%] left-1/4 z-10 flex flex-row place-items-start mt-4 ml-4">
                {showPicker && <SketchPicker color={customColor} onChange={handleCustomColorChange} />}
              </div>
            </div>
          </div>

          <div className="flex flex-col mt-[2.63rem]">
            <div className="flex w-[5.625rem] h-[2.0315rem] mb-[1.01rem]">
              <span className="text-[2rem] font-semibold">글꼴</span>
            </div>
            <div className="flex flex-row items-center gap-3">
              {FONT_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => setCreateSurvey({ ...createSurvey, font: item.id })}
                >
                  <div
                    className={`flex justify-center items-center w-[10.5rem] h-[5.5rem] rounded-[1.5rem] border-solid border-[0.188rem] ${
                      createSurvey.font === item.id ? 'border-purple' : 'border-white'
                    }`}
                  >
                    <div className="flex justify-center items-center w-40 h-20 rounded-[1.25rem] border-solid border-[0.06rem] border-[#B4B4B4]">
                      <span className={`text-xl ${item.fontClass}`}>{item.text}</span>
                    </div>
                  </div>
                  <div className="flex w-[7.875rem] h-4 justify-center items-center mt-[0.63rem]">
                    <span
                      className={`text-[1rem] font-medium ${item.fontClass} ${
                        createSurvey.font === item.id ? 'text-black' : 'text-[#B4B4B4]'
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col mt-[2.63rem]">
            <div className="flex flex-row items-center justify-start w-full mb-[1.01rem]">
              <span className="text-[2rem] font-semibold">커버 이미지</span>
              <div className="flex items-center mx-8">
                <TextButton text="이미지 검색" onClick={handleImageSearchClick} />
              </div>
              {isImageSearchModalVisible && (
                <ImageSearchModal
                  isVisible={isImageSearchModalVisible}
                  onClose={() => setImageSearchModalVisible(false)}
                  onSelectImage={handleSelectImage}
                />
              )}
            </div>
            <div className="flex flex-row">
              <div
                className="flex justify-center items-center w-[18.75rem] h-[12.5rem] border-dashed border-[0.06rem] border-[#b4b4b4]"
                onClick={() => document.getElementById('imageInput')?.click()}
              >
                {mainImg ? (
                  <img src={mainImg} alt="Uploaded Cover" className="w-full h-full" />
                ) : (
                  <img src={insertImage} alt="insertImage" className="w-full h-full" />
                )}
                <input
                  id="imageInput"
                  type="file"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  accept="image/png, image/jpeg"
                />
              </div>
              <button
                type="button"
                className="flex items-end justify-center focus:outline-none mx-2"
                onClick={handleDeleteImage} // 이미지 삭제
              >
                <img src={deleteIcon} alt="Delete" className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-row items-center mt-[2.63rem]">
            <div className="flex w-[6rem] h-[2.0315rem]  ">
              <span className="text-[2rem] font-semibold">마감일</span>
            </div>
            <div className="flex w-[10rem] h-[3.125rem] justify-center ml-5 rounded-[0.625rem] border-solid border-[0.06rem] border-[#b4b4b4]">
              <input
                name="date"
                type="date"
                value={createSurvey.deadline}
                onChange={(e) => setCreateSurvey({ ...createSurvey, deadline: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex flex-row mt-[2.63rem] mb-[2.38rem]">
            <div className="flex flex-col">
              <div className="flex w-[14rem] h-[2.0315rem] mb-[1.01rem]">
                <span className="text-[2rem] font-semibold">설문 공개 여부</span>
              </div>
              <div className="flex flex-row items-center gap-3">
                {OPTION_ITEMS.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => handleOptionClick(item.id)}
                  >
                    <div
                      className={`flex justify-center items-center w-[10.5rem] h-[5.5rem] rounded-[1.5rem] border-solid border-[0.188rem] ${
                        (createSurvey.open && item.id === 'public') || (!createSurvey.open && item.id === 'private')
                          ? 'border-[#918DCA]'
                          : 'border-white'
                      }`}
                    >
                      <div className="flex flex-col justify-center items-center w-40 h-20 rounded-[1.25rem] border-solid border-[0.06rem] border-[#B4B4B4]">
                        <img
                          src={item.id === 'public' ? publicIcon : privateIcon}
                          alt={`${item.id}Icon`}
                          className="mb-2"
                        />
                        <span
                          className={`text-base font-normal ${
                            (createSurvey.open && item.id === 'public') || (!createSurvey.open && item.id === 'private')
                              ? 'text-black'
                              : 'text-[#b4b4b4]'
                          }`}
                        >
                          {item.text}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex flex-col ml-10 tracking-widest font-normal text-[1rem] text-[#8E8E8E]">
                  <span className="mb-1">공개: 누구나 설문에 참여 가능하고, 설문 데이터 열람이 가능합니다.</span>
                  <span>비공개: 링크를 통해서만 참여 가능하고, 설문 데이터 열람이 불가능합니다.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // 문제 생성
        <div className="relative flex flex-col h-full px-[8.75rem] ">
          <div className="flex items-center justify-start gap-6 my-6">
            <p className="text-[2rem] font-semibold text-black">문제</p>
            <AddButton
              text="추가"
              onClick={() => {
                handleAddQuestion();
              }}
            />
            {addQuestionDropdown && <CreateQuestionMenu onSelect={addQuestion} />}
          </div>

          <div className="flex flex-col items-center justify-center">
            {createSurvey.questions.length === 0 ? (
              <p className="text-gray">설문 문항을 등록하세요.</p>
            ) : (
              createSurvey.questions.map((item, index) => {
                return (
                  <div key={index} className="pb-6">
                    {renderQuestionComponent(item.type)}
                  </div>
                );
              })
            )}
          </div>

          {createSurvey.questions.length > 0 && (
            <div className="flex items-center justify-center pt-2">
              <TextButton text="저장하기" onClick={handleSubmit} />
            </div>
          )}

          {isError && <Alert type="error" message="설문 생성에 실패했습니다." buttonText="확인" />}
          {isSuccess && (
            <Alert
              type="success"
              message="설문이 생성되었습니다."
              buttonText="확인"
              buttonClick={() => navigate(activeItem === 'all' ? '/all' : '/myform')}
            />
          )}
        </div>
      )}
    </Scrollbars>
  );
}

export default Create;
